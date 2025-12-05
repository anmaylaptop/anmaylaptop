import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StudentData {
  id: string;
  application_id: string | null;
  full_name: string;
  birth_year: number;
  phone: string;
  address: string;
  facebook_link: string | null;
  academic_year: string;
  difficult_situation: string;
  need_laptop: boolean;
  laptop_received: boolean;
  laptop_received_date: string | null;
  need_motorbike: boolean;
  motorbike_received: boolean;
  motorbike_received_date: string | null;
  need_tuition: boolean;
  tuition_supported: boolean;
  tuition_support_start_date: string | null;
  need_components: boolean;
  components_details: string | null;
  components_received: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentFilters {
  search?: string;
  academicYear?: string | "all";
  needType?: string | "all";
  receivedStatus?: "received" | "not_received" | "all";
}

export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: async () => {
      let query = supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(
          `full_name.ilike.${searchTerm},phone.ilike.${searchTerm},facebook_link.ilike.${searchTerm}`
        );
      }

      // Apply academic year filter
      if (filters.academicYear && filters.academicYear !== "all") {
        query = query.eq("academic_year", filters.academicYear);
      }

      // Apply need type filter
      if (filters.needType && filters.needType !== "all") {
        switch (filters.needType) {
          case "laptop":
            query = query.eq("need_laptop", true);
            break;
          case "motorbike":
            query = query.eq("need_motorbike", true);
            break;
          case "tuition":
            query = query.eq("need_tuition", true);
            break;
          case "components":
            query = query.eq("need_components", true);
            break;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching students:", error);
        throw error;
      }

      // Apply received status filter in memory (since it requires complex logic)
      let filteredData = data as StudentData[];
      if (filters.receivedStatus && filters.receivedStatus !== "all") {
        filteredData = filteredData.filter((student) => {
          const hasReceivedAny =
            (student.need_laptop && student.laptop_received) ||
            (student.need_motorbike && student.motorbike_received) ||
            (student.need_tuition && student.tuition_supported) ||
            (student.need_components && student.components_received);

          const hasReceivedAll =
            (!student.need_laptop || student.laptop_received) &&
            (!student.need_motorbike || student.motorbike_received) &&
            (!student.need_tuition || student.tuition_supported) &&
            (!student.need_components || student.components_received);

          if (filters.receivedStatus === "received") {
            return hasReceivedAll;
          } else {
            return !hasReceivedAll && 
                   (student.need_laptop || student.need_motorbike || 
                    student.need_tuition || student.need_components);
          }
        });
      }

      return filteredData;
    },
  });
}

export function useStudent(id: string | null) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        throw error;
      }

      return data as StudentData;
    },
    enabled: !!id,
  });
}

interface UpdateStudentParams {
  id: string;
  updates: Partial<Omit<StudentData, "id" | "created_at" | "updated_at">>;
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateStudentParams) => {
      const { data, error } = await supabase
        .from("students")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating student:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      toast.success("Cập nhật thông tin sinh viên thành công");
    },
    onError: (error) => {
      console.error("Error updating student:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

interface MarkReceivedParams {
  id: string;
  type: "laptop" | "motorbike" | "tuition" | "components";
  received: boolean;
}

export function useMarkReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type, received }: MarkReceivedParams) => {
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      switch (type) {
        case "laptop":
          updates.laptop_received = received;
          if (received) {
            updates.laptop_received_date = new Date().toISOString();
          } else {
            updates.laptop_received_date = null;
          }
          break;
        case "motorbike":
          updates.motorbike_received = received;
          if (received) {
            updates.motorbike_received_date = new Date().toISOString();
          } else {
            updates.motorbike_received_date = null;
          }
          break;
        case "tuition":
          updates.tuition_supported = received;
          if (received) {
            updates.tuition_support_start_date = new Date().toISOString();
          } else {
            updates.tuition_support_start_date = null;
          }
          break;
        case "components":
          updates.components_received = received;
          break;
      }

      const { data, error } = await supabase
        .from("students")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error marking received:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      const typeText = {
        laptop: "Laptop",
        motorbike: "Xe máy",
        tuition: "Học phí",
        components: "Linh kiện",
      }[variables.type];
      const statusText = variables.received ? "đã nhận" : "chưa nhận";
      toast.success(`Đã cập nhật ${typeText} ${statusText}`);
    },
    onError: (error) => {
      console.error("Error marking received:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });
}

interface DeleteStudentParams {
  id: string;
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteStudentParams) => {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) {
        console.error("Error deleting student:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Đã xóa sinh viên");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      toast.error("Có lỗi xảy ra khi xóa sinh viên");
    },
  });
}
