export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      backups: {
        Row: {
          created_by: string
          file_size: number | null
          file_url: string | null
          id: string
          notes: string | null
          status: string
          timestamp: string
        }
        Insert: {
          created_by: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string
          timestamp?: string
        }
        Update: {
          created_by?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "backups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          animal_type: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          animal_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          animal_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          batch_number: string | null
          category: string
          cost: number | null
          created_at: string
          expiry_date: string | null
          id: string
          name: string
          price: number
          quantity: number
          reorder_level: number | null
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          category: string
          cost?: number | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          name: string
          price: number
          quantity?: number
          reorder_level?: number | null
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          category?: string
          cost?: number | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          name?: string
          price?: number
          quantity?: number
          reorder_level?: number | null
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          active: boolean
          applicable_categories: string[] | null
          applicable_products: string[] | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          minimum_quantity: number | null
          name: string
          start_date: string | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at: string
          value: number
        }
        Insert: {
          active?: boolean
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          minimum_quantity?: number | null
          name: string
          start_date?: string | null
          type: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string
          value: number
        }
        Update: {
          active?: boolean
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          minimum_quantity?: number | null
          name?: string
          start_date?: string | null
          type?: Database["public"]["Enums"]["promotion_type"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      restocks: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          created_by: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          restock_date: string
          supplier_id: string | null
          total_cost: number | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          restock_date?: string
          supplier_id?: string | null
          total_cost?: number | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          restock_date?: string
          supplier_id?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restocks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restocks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restocks_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          id: string
          product_id: string
          quantity: number
          sale_id: string
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          product_id: string
          quantity: number
          sale_id: string
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          product_id?: string
          quantity?: number
          sale_id?: string
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cashier_id: string
          change_given: number | null
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_received: number | null
          subtotal: number
          tax_amount: number | null
          total: number
        }
        Insert: {
          cashier_id: string
          change_given?: number | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_received?: number | null
          subtotal: number
          tax_amount?: number | null
          total: number
        }
        Update: {
          cashier_id?: string
          change_given?: number | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_received?: number | null
          subtotal?: number
          tax_amount?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          products_supplied: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          products_supplied?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          products_supplied?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_user_active: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      update_last_login: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      payment_method: "cash" | "mobile_money" | "card"
      promotion_type: "fixed" | "percentage" | "buy_x_get_y"
      user_role: "admin" | "cashier" | "inventory_manager"
      user_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_method: ["cash", "mobile_money", "card"],
      promotion_type: ["fixed", "percentage", "buy_x_get_y"],
      user_role: ["admin", "cashier", "inventory_manager"],
      user_status: ["active", "inactive"],
    },
  },
} as const
