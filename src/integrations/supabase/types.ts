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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          topic?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          current_class: string
          email: string | null
          exam: string | null
          guidance_preview_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          plan: string | null
          prep_status: string | null
          problems: string[] | null
          source: string | null
          status: string
          subjects: string[] | null
          target_year: string | null
        }
        Insert: {
          created_at?: string
          current_class: string
          email?: string | null
          exam?: string | null
          guidance_preview_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          plan?: string | null
          prep_status?: string | null
          problems?: string[] | null
          source?: string | null
          status?: string
          subjects?: string[] | null
          target_year?: string | null
        }
        Update: {
          created_at?: string
          current_class?: string
          email?: string | null
          exam?: string | null
          guidance_preview_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          plan?: string | null
          prep_status?: string | null
          problems?: string[] | null
          source?: string | null
          status?: string
          subjects?: string[] | null
          target_year?: string | null
        }
        Relationships: []
      }
      mentor_applications: {
        Row: {
          category: string | null
          created_at: string
          exam: string | null
          id: string
          iit_name: string | null
          jee_rank: number
          name: string
          phone: string
          status: string
          year_of_study: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          exam?: string | null
          id?: string
          iit_name?: string | null
          jee_rank: number
          name: string
          phone: string
          status?: string
          year_of_study?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          exam?: string | null
          id?: string
          iit_name?: string | null
          jee_rank?: number
          name?: string
          phone?: string
          status?: string
          year_of_study?: string | null
        }
        Relationships: []
      }
      resource_submissions: {
        Row: {
          body: string | null
          created_at: string
          description: string | null
          exam: string
          id: string
          image_url: string | null
          kind: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitter_credential: string | null
          submitter_email: string
          submitter_name: string
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          description?: string | null
          exam?: string
          id?: string
          image_url?: string | null
          kind: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitter_credential?: string | null
          submitter_email: string
          submitter_name: string
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          description?: string | null
          exam?: string
          id?: string
          image_url?: string | null
          kind?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitter_credential?: string | null
          submitter_email?: string
          submitter_name?: string
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      resource_submissions_public: {
        Row: {
          body: string | null
          created_at: string | null
          description: string | null
          exam: string | null
          id: string | null
          image_url: string | null
          kind: string | null
          status: string | null
          submitter_credential: string | null
          submitter_name: string | null
          title: string | null
          youtube_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          description?: string | null
          exam?: string | null
          id?: string | null
          image_url?: string | null
          kind?: string | null
          status?: string | null
          submitter_credential?: string | null
          submitter_name?: string | null
          title?: string | null
          youtube_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          description?: string | null
          exam?: string | null
          id?: string | null
          image_url?: string | null
          kind?: string | null
          status?: string | null
          submitter_credential?: string | null
          submitter_name?: string | null
          title?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
