import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ApplicationStatus } from "@/types/applications";

export interface DonorApplicationData {
  id: string;
  full_name: string;
  birth_year: number;
  phone: string;
  address: string;
  facebook_link: string | null;
  support_types: string[];
  support_frequency: string;
  support_details: string | null;
  status: ApplicationStatus;
  rejection_reason: string | null;
  notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentApplicationData {
  id: string;
  full_name: string;
  birth_year: number;
  phone: string;
  address: string;
  facebook_link: string | null;
  academic_year: string;
  difficult_situation: string;
  need_laptop: boolean;
  need_motorbike: boolean;
  need_tuition: boolean;
  need_components: boolean;
  components_details: string | null;
  status: ApplicationStatus;
  rejection_reason: string | null;
  verification_notes: string | null;
  notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus | "all";
}

export function useDonorApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ["donor-applications", filters],
    queryFn: async () => {
      let query = supabase
        .from("donor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply status filter
      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(
          `full_name.ilike.${searchTerm},phone.ilike.${searchTerm},facebook_link.ilike.${searchTerm}`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching donor applications:", error);
        throw error;
      }

      return data as DonorApplicationData[];
    },
  });
}

export function useStudentApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ["student-applications", filters],
    queryFn: async () => {
      let query = supabase
        .from("student_applications")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply status filter
      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(
          `full_name.ilike.${searchTerm},phone.ilike.${searchTerm},facebook_link.ilike.${searchTerm}`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching student applications:", error);
        throw error;
      }

      return data as StudentApplicationData[];
    },
  });
}

interface UpdateApplicationStatusParams {
  id: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  notes?: string;
  type: "donor" | "student";
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, rejectionReason, notes, type }: UpdateApplicationStatusParams) => {
      const table = type === "donor" ? "donor_applications" : "student_applications";
      
      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (status === "rejected" && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      if (notes) {
        updateData.notes = notes;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        updateData.reviewed_by = user.id;
      }

      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${type} application:`, error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["donor-applications"] });
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      
      const statusText = variables.status === "approved" ? "đã được duyệt" : "đã bị từ chối";
      toast.success(`Đơn đăng ký ${statusText} thành công`);
    },
    onError: (error) => {
      console.error("Error updating application status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đơn đăng ký");
    },
  });
}

export function useDonorApplication(id: string | null) {
  return useQuery({
    queryKey: ["donor-application", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("donor_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching donor application:", error);
        throw error;
      }

      return data as DonorApplicationData;
    },
    enabled: !!id,
  });
}

export function useStudentApplication(id: string | null) {
  return useQuery({
    queryKey: ["student-application", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("student_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student application:", error);
        throw error;
      }

      return data as StudentApplicationData;
    },
    enabled: !!id,
  });
}
