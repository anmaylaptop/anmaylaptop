export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      donor_applications: {
        Row: {
          id: string
          full_name: string
          phone: string
          address: string
          facebook_link: string | null
          area_id: string | null
          support_types: string[]
          support_details: string | null
          laptop_quantity: number | null
          motorbike_quantity: number | null
          components_quantity: number | null
          tuition_amount: number | null
          tuition_frequency: string | null
          status: string
          rejection_reason: string | null
          notes: string | null
          created_at: string
          updated_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          address: string
          facebook_link?: string | null
          area_id?: string | null
          support_types: string[]
          support_details?: string | null
          laptop_quantity?: number | null
          motorbike_quantity?: number | null
          components_quantity?: number | null
          tuition_amount?: number | null
          tuition_frequency?: string | null
          status?: string
          rejection_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          address?: string
          facebook_link?: string | null
          area_id?: string | null
          support_types?: string[]
          support_details?: string | null
          laptop_quantity?: number | null
          motorbike_quantity?: number | null
          components_quantity?: number | null
          tuition_amount?: number | null
          tuition_frequency?: string | null
          status?: string
          rejection_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donor_applications_area_id_fkey"
            columns: ["area_id"]
            referencedRelation: "areas"
            referencedColumns: ["id"]
          }
        ]
      }
      student_applications: {
        Row: {
          id: string
          full_name: string
          birth_year: number
          phone: string
          address: string
          facebook_link: string | null
          area_id: string | null
          academic_year: string
          difficult_situation: string
          need_laptop: boolean
          need_motorbike: boolean
          need_tuition: boolean
          need_components: boolean
          components_details: string | null
          status: string
          rejection_reason: string | null
          verification_notes: string | null
          notes: string | null
          created_at: string
          updated_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          full_name: string
          birth_year: number
          phone: string
          address: string
          facebook_link?: string | null
          area_id?: string | null
          academic_year: string
          difficult_situation: string
          need_laptop?: boolean
          need_motorbike?: boolean
          need_tuition?: boolean
          need_components?: boolean
          components_details?: string | null
          status?: string
          rejection_reason?: string | null
          verification_notes?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          birth_year?: number
          phone?: string
          address?: string
          facebook_link?: string | null
          area_id?: string | null
          academic_year?: string
          difficult_situation?: string
          need_laptop?: boolean
          need_motorbike?: boolean
          need_tuition?: boolean
          need_components?: boolean
          components_details?: string | null
          status?: string
          rejection_reason?: string | null
          verification_notes?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_applications_area_id_fkey"
            columns: ["area_id"]
            referencedRelation: "areas"
            referencedColumns: ["id"]
          }
        ]
      }
      areas: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          id: string
          application_id: string | null
          full_name: string
          phone: string
          address: string
          facebook_link: string | null
          area_id: string | null
          support_types: string[]
          support_frequency: string
          support_details: string | null
          laptop_quantity: number | null
          motorbike_quantity: number | null
          components_quantity: number | null
          tuition_amount: number | null
          tuition_frequency: string | null
          support_end_date: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          full_name: string
          phone: string
          address: string
          facebook_link?: string | null
          area_id?: string | null
          support_types: string[]
          support_frequency: string
          support_details?: string | null
          laptop_quantity?: number | null
          motorbike_quantity?: number | null
          components_quantity?: number | null
          tuition_amount?: number | null
          tuition_frequency?: string | null
          support_end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          full_name?: string
          phone?: string
          address?: string
          facebook_link?: string | null
          area_id?: string | null
          support_types?: string[]
          support_frequency?: string
          support_details?: string | null
          laptop_quantity?: number | null
          motorbike_quantity?: number | null
          components_quantity?: number | null
          tuition_amount?: number | null
          tuition_frequency?: string | null
          support_end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donors_area_id_fkey"
            columns: ["area_id"]
            referencedRelation: "areas"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          id: string
          application_id: string | null
          full_name: string
          birth_year: number
          phone: string
          address: string
          facebook_link: string | null
          area_id: string | null
          academic_year: string
          difficult_situation: string
          need_laptop: boolean
          laptop_received: boolean
          laptop_received_date: string | null
          need_motorbike: boolean
          motorbike_received: boolean
          motorbike_received_date: string | null
          need_tuition: boolean
          tuition_supported: boolean
          tuition_support_start_date: string | null
          need_components: boolean
          components_details: string | null
          components_received: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          full_name: string
          birth_year: number
          phone: string
          address: string
          facebook_link?: string | null
          area_id?: string | null
          academic_year: string
          difficult_situation: string
          need_laptop?: boolean
          laptop_received?: boolean
          laptop_received_date?: string | null
          need_motorbike?: boolean
          motorbike_received?: boolean
          motorbike_received_date?: string | null
          need_tuition?: boolean
          tuition_supported?: boolean
          tuition_support_start_date?: string | null
          need_components?: boolean
          components_details?: string | null
          components_received?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          full_name?: string
          birth_year?: number
          phone?: string
          address?: string
          facebook_link?: string | null
          area_id?: string | null
          academic_year?: string
          difficult_situation?: string
          need_laptop?: boolean
          laptop_received?: boolean
          laptop_received_date?: string | null
          need_motorbike?: boolean
          motorbike_received?: boolean
          motorbike_received_date?: string | null
          need_tuition?: boolean
          tuition_supported?: boolean
          tuition_support_start_date?: string | null
          need_components?: boolean
          components_details?: string | null
          components_received?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_area_id_fkey"
            columns: ["area_id"]
            referencedRelation: "areas"
            referencedColumns: ["id"]
          }
        ]
      }
      laptops: {
        Row: {
          id: string
          donor_id: string | null
          student_id: string | null
          brand: string | null
          model: string | null
          specifications: string | null
          condition: string | null
          notes: string | null
          status: string
          received_date: string
          assigned_date: string | null
          delivered_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          brand?: string | null
          model?: string | null
          specifications?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          brand?: string | null
          model?: string | null
          specifications?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      motorbikes: {
        Row: {
          id: string
          donor_id: string | null
          student_id: string | null
          brand: string | null
          model: string | null
          year: number | null
          license_plate: string | null
          condition: string | null
          notes: string | null
          status: string
          received_date: string
          assigned_date: string | null
          delivered_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          brand?: string | null
          model?: string | null
          year?: number | null
          license_plate?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          brand?: string | null
          model?: string | null
          year?: number | null
          license_plate?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          id: string
          donor_id: string | null
          student_id: string | null
          component_type: string
          brand: string | null
          model: string | null
          specifications: string | null
          condition: string | null
          notes: string | null
          status: string
          received_date: string
          assigned_date: string | null
          delivered_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          component_type: string
          brand?: string | null
          model?: string | null
          specifications?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          component_type?: string
          brand?: string | null
          model?: string | null
          specifications?: string | null
          condition?: string | null
          notes?: string | null
          status?: string
          received_date?: string
          assigned_date?: string | null
          delivered_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tuition_support: {
        Row: {
          id: string
          donor_id: string | null
          student_id: string | null
          amount: number
          frequency: string
          academic_year: string | null
          semester: number | null
          notes: string | null
          status: string
          pledged_date: string
          paid_date: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          amount: number
          frequency: string
          academic_year?: string | null
          semester?: number | null
          notes?: string | null
          status?: string
          pledged_date?: string
          paid_date?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          student_id?: string | null
          amount?: number
          frequency?: string
          academic_year?: string | null
          semester?: number | null
          notes?: string | null
          status?: string
          pledged_date?: string
          paid_date?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      support_type: "laptop" | "motorbike" | "components" | "tuition"
      support_frequency: "one_time" | "recurring"
      academic_year: "1" | "2" | "3" | "4"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "approved", "rejected"],
      support_type: ["laptop", "motorbike", "components", "tuition"],
      support_frequency: ["one_time", "recurring"],
      academic_year: ["1", "2", "3", "4"],
    },
  },
} as const
