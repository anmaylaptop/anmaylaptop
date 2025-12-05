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

      // Update application status
      const { data: applicationData, error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error(`Error updating ${type} application:`, updateError);
        throw updateError;
      }

      // If approved, create corresponding donor/student record
      if (status === "approved") {
        // Check if record already exists to prevent duplicates
        const targetTable = type === "donor" ? "donors" : "students";
        const { data: existingRecord } = await supabase
          .from(targetTable)
          .select("id")
          .eq("application_id", id)
          .single();

        if (!existingRecord) {
          if (type === "donor") {
            // Create donor record from application
          const donorData = {
            application_id: applicationData.id,
            full_name: applicationData.full_name,
            birth_year: applicationData.birth_year,
            phone: applicationData.phone,
            address: applicationData.address,
            facebook_link: applicationData.facebook_link,
            support_types: applicationData.support_types,
            support_frequency: applicationData.support_frequency,
            support_details: applicationData.support_details,
            support_end_date: null,
            is_active: true,
            notes: applicationData.notes,
          };

          const { error: donorError } = await supabase
            .from("donors")
            .insert(donorData);

          if (donorError) {
            console.error("Error creating donor record:", donorError);
            throw donorError;
          }
        } else {
          // Create student record from application
          const studentData = {
            application_id: applicationData.id,
            full_name: applicationData.full_name,
            birth_year: applicationData.birth_year,
            phone: applicationData.phone,
            address: applicationData.address,
            facebook_link: applicationData.facebook_link,
            academic_year: applicationData.academic_year,
            difficult_situation: applicationData.difficult_situation,
            need_laptop: applicationData.need_laptop,
            laptop_received: false,
            laptop_received_date: null,
            need_motorbike: applicationData.need_motorbike,
            motorbike_received: false,
            motorbike_received_date: null,
            need_tuition: applicationData.need_tuition,
            tuition_supported: false,
            tuition_support_start_date: null,
            need_components: applicationData.need_components,
            components_details: applicationData.components_details,
            components_received: false,
            notes: applicationData.notes,
          };

          const { error: studentError } = await supabase
            .from("students")
            .insert(studentData);

          if (studentError) {
            console.error("Error creating student record:", studentError);
            throw studentError;
          }
        }
        }
      }

      return applicationData;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["donor-applications"] });
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      
      // Also invalidate donors/students queries if approved
      if (variables.status === "approved") {
        if (variables.type === "donor") {
          queryClient.invalidateQueries({ queryKey: ["donors"] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["students"] });
        }
      }
      
      const statusText = variables.status === "approved" ? "đã được duyệt" : "đã bị từ chối";
      const typeText = variables.type === "donor" ? "nhà hảo tâm" : "sinh viên";
      
      if (variables.status === "approved") {
        toast.success(`Đơn đăng ký ${statusText} thành công. ${typeText.charAt(0).toUpperCase() + typeText.slice(1)} đã được thêm vào danh sách.`);
      } else {
        toast.success(`Đơn đăng ký ${statusText} thành công`);
      }
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
