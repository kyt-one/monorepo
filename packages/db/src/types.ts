export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      analytics_snapshots: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          history: Json;
          id: string;
          platform_id: string;
          provider: Database["public"]["Enums"]["connected_account_provider"];
          stats: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          history?: Json;
          id?: string;
          platform_id: string;
          provider: Database["public"]["Enums"]["connected_account_provider"];
          stats: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          history?: Json;
          id?: string;
          platform_id?: string;
          provider?: Database["public"]["Enums"]["connected_account_provider"];
          stats?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_snapshots_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      connected_accounts: {
        Row: {
          access_token: string;
          account_id: string;
          created_at: string;
          deleted_at: string | null;
          expires_at: string | null;
          id: string;
          provider: Database["public"]["Enums"]["connected_account_provider"];
          refresh_token: string | null;
          scope: string | null;
          status: Database["public"]["Enums"]["connected_account_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_token: string;
          account_id: string;
          created_at?: string;
          deleted_at?: string | null;
          expires_at?: string | null;
          id?: string;
          provider: Database["public"]["Enums"]["connected_account_provider"];
          refresh_token?: string | null;
          scope?: string | null;
          status?: Database["public"]["Enums"]["connected_account_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_token?: string;
          account_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          expires_at?: string | null;
          id?: string;
          provider?: Database["public"]["Enums"]["connected_account_provider"];
          refresh_token?: string | null;
          scope?: string | null;
          status?: Database["public"]["Enums"]["connected_account_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "connected_accounts_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      media_kit_events: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          event_type: Database["public"]["Enums"]["media_kit_event_type"];
          id: string;
          kit_id: string;
          meta: Json | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          event_type: Database["public"]["Enums"]["media_kit_event_type"];
          id?: string;
          kit_id: string;
          meta?: Json | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          event_type?: Database["public"]["Enums"]["media_kit_event_type"];
          id?: string;
          kit_id?: string;
          meta?: Json | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_kit_events_kit_id_media_kits_id_fk";
            columns: ["kit_id"];
            isOneToOne: false;
            referencedRelation: "media_kits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_kit_events_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      media_kits: {
        Row: {
          blocks: Json;
          created_at: string;
          default: boolean;
          deleted_at: string | null;
          id: string;
          profile_override: Json;
          published: boolean;
          slug: string;
          theme: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          blocks: Json;
          created_at?: string;
          default?: boolean;
          deleted_at?: string | null;
          id?: string;
          profile_override?: Json;
          published?: boolean;
          slug: string;
          theme?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          blocks?: Json;
          created_at?: string;
          default?: boolean;
          deleted_at?: string | null;
          id?: string;
          profile_override?: Json;
          published?: boolean;
          slug?: string;
          theme?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_kits_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string;
          created_at: string;
          deleted_at: string | null;
          email: string;
          id: string;
          onboarding_steps: Database["public"]["Enums"]["onboarding_steps"][];
          tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar_url?: string;
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          id: string;
          onboarding_steps?: Database["public"]["Enums"]["onboarding_steps"][];
          tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string;
          username?: string;
        };
        Update: {
          avatar_url?: string;
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          id?: string;
          onboarding_steps?: Database["public"]["Enums"]["onboarding_steps"][];
          tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string;
          customer_id: number;
          deleted_at: string | null;
          id: string;
          interval: Database["public"]["Enums"]["subscription_interval"];
          price_id: number;
          provider: Database["public"]["Enums"]["subscription_provider"];
          subscription_id: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_period_end: string;
          customer_id: number;
          deleted_at?: string | null;
          id?: string;
          interval: Database["public"]["Enums"]["subscription_interval"];
          price_id: number;
          provider: Database["public"]["Enums"]["subscription_provider"];
          subscription_id: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string;
          customer_id?: number;
          deleted_at?: string | null;
          id?: string;
          interval?: Database["public"]["Enums"]["subscription_interval"];
          price_id?: number;
          provider?: Database["public"]["Enums"]["subscription_provider"];
          subscription_id?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      accounts_due_for_update_view: {
        Row: {
          access_token: string | null;
          account_id: string | null;
          expires_at: string | null;
          id: string | null;
          provider: Database["public"]["Enums"]["connected_account_provider"] | null;
          refresh_token: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "connected_accounts_user_id_profiles_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      complete_onboarding_step: {
        Args: { step_name: string };
        Returns: undefined;
      };
    };
    Enums: {
      connected_account_provider: "youtube" | "instagram";
      connected_account_status: "active" | "error" | "expired";
      media_kit_event_type: "view" | "share" | "contact_click" | "link_click";
      onboarding_steps: "username" | "avatar" | "stats" | "welcome";
      subscription_interval: "month" | "year";
      subscription_provider: "lemon-squeezy";
      subscription_tier: "free" | "pro";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      connected_account_provider: ["youtube", "instagram"],
      connected_account_status: ["active", "error", "expired"],
      media_kit_event_type: ["view", "share", "contact_click", "link_click"],
      onboarding_steps: ["username", "avatar", "stats", "welcome"],
      subscription_interval: ["month", "year"],
      subscription_provider: ["lemon-squeezy"],
      subscription_tier: ["free", "pro"],
    },
  },
} as const;
