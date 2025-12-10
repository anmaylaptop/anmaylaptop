import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonorData } from "./useDonors";

interface FindDonorParams {
  phone?: string;
  facebookLink?: string;
  enabled?: boolean;
}

/**
 * Hook to find donor by phone number or Facebook link
 * @param params - Search parameters
 * @returns Query result with donor data if found
 */
export function useFindDonor({ phone, facebookLink, enabled = true }: FindDonorParams) {
  return useQuery({
    queryKey: ["find-donor", { phone, facebookLink }],
    queryFn: async (): Promise<DonorData | null> => {
      // Need at least one search criterion
      if (!phone && !facebookLink) {
        return null;
      }

      let query = supabase
        .from("donors")
        .select("*")
        .eq("is_active", true);

      // Search by phone or Facebook link
      if (phone && facebookLink) {
        query = query.or(`phone.eq.${phone},facebook_link.eq.${facebookLink}`);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else if (facebookLink) {
        query = query.eq("facebook_link", facebookLink);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error finding donor:", error);
        throw error;
      }

      return data as DonorData | null;
    },
    enabled: enabled && (!!phone || !!facebookLink),
    staleTime: 30000, // 30 seconds
  });
}
