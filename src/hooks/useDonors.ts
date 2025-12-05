import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DonorData {
  id: string;
  application_id: string | null;
  full_name: string;
  birth_year: number;
  phone: string;
  address: string;
  facebook_link: string | null;
  support_types: string[];
  support_frequency: string;
  support_details: string | null;
  laptop_quantity: number | null;
  motorbike_quantity: number | null;
  components_quantity: number | null;
  tuition_amount: number | null;
  tuition_frequency: string | null;
  support_end_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DonorFilters {
  search?: string;
  supportType?: string | "all";
  frequency?: string | "all";
  isActive?: boolean | "all";
}

export function useDonors(filters: DonorFilters = {}) {
  return useQuery({
    queryKey: ["donors", filters],
    queryFn: async () => {
      let query = supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(
          `full_name.ilike.${searchTerm},phone.ilike.${searchTerm},facebook_link.ilike.${searchTerm}`
        );
      }

      // Apply support type filter
      if (filters.supportType && filters.supportType !== "all") {
        query = query.contains("support_types", [filters.supportType]);
      }

      // Apply frequency filter
      if (filters.frequency && filters.frequency !== "all") {
        query = query.eq("support_frequency", filters.frequency);
      }

      // Apply active status filter
      if (typeof filters.isActive === "boolean") {
        query = query.eq("is_active", filters.isActive);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching donors:", error);
        throw error;
      }

      return data as DonorData[];
    },
  });
}

export function useDonor(id: string | null) {
  return useQuery({
    queryKey: ["donor", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching donor:", error);
        throw error;
      }

      return data as DonorData;
    },
    enabled: !!id,
  });
}

interface UpdateDonorParams {
  id: string;
  updates: Partial<Omit<DonorData, "id" | "created_at" | "updated_at">>;
}

export function useUpdateDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateDonorParams) => {
      const { data, error } = await supabase
        .from("donors")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating donor:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["donor"] });
      toast.success("Cập nhật thông tin nhà hảo tâm thành công");
    },
    onError: (error) => {
      console.error("Error updating donor:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}

export function useToggleDonorActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("donors")
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error toggling donor active status:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["donor"] });
      const statusText = variables.isActive ? "kích hoạt" : "vô hiệu hóa";
      toast.success(`Đã ${statusText} nhà hảo tâm`);
    },
    onError: (error) => {
      console.error("Error toggling donor active status:", error);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái");
    },
  });
}

interface DeleteDonorParams {
  id: string;
}

export function useDeleteDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteDonorParams) => {
      const { error } = await supabase.from("donors").delete().eq("id", id);

      if (error) {
        console.error("Error deleting donor:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      toast.success("Đã xóa nhà hảo tâm");
    },
    onError: (error) => {
      console.error("Error deleting donor:", error);
      toast.error("Có lỗi xảy ra khi xóa nhà hảo tâm");
    },
  });
}
