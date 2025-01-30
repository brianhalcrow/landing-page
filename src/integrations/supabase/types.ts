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
      cf_firmcom_ap: {
        Row: {
          cost_centre: string | null
          country_currency_id: number | null
          created_date: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          entity: string | null
          entity_id: string | null
          geo_structure_entity_id: number | null
          id: number
          invoice_date: string
          invoice_id: string | null
          legal_entity_id: string | null
          paid_date: string | null
          payment_terms_days: number | null
          po_id: string | null
          subsystem_code: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number | null
          created_date?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          entity?: string | null
          entity_id?: string | null
          geo_structure_entity_id?: number | null
          id: number
          invoice_date: string
          invoice_id?: string | null
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number | null
          created_date?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          entity?: string | null
          entity_id?: string | null
          geo_structure_entity_id?: number | null
          id?: number
          invoice_date?: string
          invoice_id?: string | null
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: []
      }
      cf_firmcom_ar: {
        Row: {
          cost_centre: string | null
          country_currency_id: number | null
          currency: string | null
          customer_id: string | null
          customer_name: string | null
          description: string | null
          due_date: string | null
          entity_id: string | null
          entity_name: string | null
          geo_structure_entity_id: number | null
          invoice_date: string | null
          invoice_id: string | null
          legal_entity_id: string | null
          paid_date: string | null
          payment_terms_days: number | null
          subsystem_code: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number | null
          currency?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: number | null
          invoice_date?: string | null
          invoice_id?: string | null
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number | null
          currency?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: number | null
          invoice_date?: string | null
          invoice_id?: string | null
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Relationships: []
      }
      cf_firmcom_po: {
        Row: {
          cost_centre: string | null
          country_currency_id: number | null
          currency: string | null
          delivery_date: string | null
          description: string | null
          entity_name: string | null
          expected_delivery_date: string | null
          geo_structure_entity_id: number | null
          id: number
          legal_entity_id: string | null
          po_date: string | null
          po_date_time: string | null
          po_id: string | null
          subsystem_code: string | null
          subtotal: number | null
          vendor_id: string
          vendor_name: string | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number | null
          currency?: string | null
          delivery_date?: string | null
          description?: string | null
          entity_name?: string | null
          expected_delivery_date?: string | null
          geo_structure_entity_id?: number | null
          id: number
          legal_entity_id?: string | null
          po_date?: string | null
          po_date_time?: string | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          vendor_id: string
          vendor_name?: string | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number | null
          currency?: string | null
          delivery_date?: string | null
          description?: string | null
          entity_name?: string | null
          expected_delivery_date?: string | null
          geo_structure_entity_id?: number | null
          id?: number
          legal_entity_id?: string | null
          po_date?: string | null
          po_date_time?: string | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          vendor_id?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      config_currencies: {
        Row: {
          entity_id: string
          exposed_currency: string | null
        }
        Insert: {
          entity_id: string
          exposed_currency?: string | null
        }
        Update: {
          entity_id?: string
          exposed_currency?: string | null
        }
        Relationships: []
      }
      config_entity: {
        Row: {
          entity_id: string | null
          entity_name: string | null
          functional_currency: string | null
        }
        Insert: {
          entity_id?: string | null
          entity_name?: string | null
          functional_currency?: string | null
        }
        Update: {
          entity_id?: string | null
          entity_name?: string | null
          functional_currency?: string | null
        }
        Relationships: []
      }
      config_exposures: {
        Row: {
          ap: boolean | null
          ap_realized: boolean | null
          ar: boolean | null
          ar_realized: boolean | null
          costs: boolean | null
          created_at: string | null
          entity_id: string
          entity_name: string
          functional_currency: string | null
          fx_realized: boolean | null
          monetary_assets: boolean | null
          monetary_liabilities: boolean | null
          net_income: boolean | null
          net_monetary: boolean | null
          other: boolean | null
          po: boolean | null
          revenue: boolean | null
        }
        Insert: {
          ap?: boolean | null
          ap_realized?: boolean | null
          ar?: boolean | null
          ar_realized?: boolean | null
          costs?: boolean | null
          created_at?: string | null
          entity_id: string
          entity_name: string
          functional_currency?: string | null
          fx_realized?: boolean | null
          monetary_assets?: boolean | null
          monetary_liabilities?: boolean | null
          net_income?: boolean | null
          net_monetary?: boolean | null
          other?: boolean | null
          po?: boolean | null
          revenue?: boolean | null
        }
        Update: {
          ap?: boolean | null
          ap_realized?: boolean | null
          ar?: boolean | null
          ar_realized?: boolean | null
          costs?: boolean | null
          created_at?: string | null
          entity_id?: string
          entity_name?: string
          functional_currency?: string | null
          fx_realized?: boolean | null
          monetary_assets?: boolean | null
          monetary_liabilities?: boolean | null
          net_income?: boolean | null
          net_monetary?: boolean | null
          other?: boolean | null
          po?: boolean | null
          revenue?: boolean | null
        }
        Relationships: []
      }
      criteria: {
        Row: {
          account_category_level_1: string | null
          entity_id: string | null
          entity_name: string | null
          exposure_category_level_1: string | null
          exposure_category_level_2: string | null
          exposure_category_level_3: string | null
          exposure_category_level_4: string | null
          exposure_config: string | null
          id: number
          subsystem_code: string | null
        }
        Insert: {
          account_category_level_1?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_level_1?: string | null
          exposure_category_level_2?: string | null
          exposure_category_level_3?: string | null
          exposure_category_level_4?: string | null
          exposure_config?: string | null
          id?: number
          subsystem_code?: string | null
        }
        Update: {
          account_category_level_1?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_level_1?: string | null
          exposure_category_level_2?: string | null
          exposure_category_level_3?: string | null
          exposure_category_level_4?: string | null
          exposure_config?: string | null
          id?: number
          subsystem_code?: string | null
        }
        Relationships: []
      }
      forecast_category: {
        Row: {
          forecast_category: string
          id: number
        }
        Insert: {
          forecast_category: string
          id: number
        }
        Update: {
          forecast_category?: string
          id?: number
        }
        Relationships: []
      }
      gl_actual: {
        Row: {
          account_category_level_4: string | null
          account_name: string | null
          account_number: string | null
          base_amount: number | null
          cost_centre: string | null
          country: string | null
          currency: string | null
          entity: string | null
          entity_id: string | null
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
          period: string | null
          transaction_amount: number | null
          year: number | null
          year_period: string | null
        }
        Insert: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id: number
          period?: string | null
          transaction_amount?: number | null
          year?: number | null
          year_period?: string | null
        }
        Update: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period?: string | null
          transaction_amount?: number | null
          year?: number | null
          year_period?: string | null
        }
        Relationships: []
      }
      gl_forecast: {
        Row: {
          account_category_level_4: string | null
          account_name: string | null
          account_number: string | null
          base_amount: number | null
          cost_centre: string | null
          country: string | null
          currency: string | null
          entity: string | null
          entity_id: string | null
          forecast_category: string | null
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
          period: string | null
          transaction_amount: number | null
          year: number | null
          year_period: string | null
        }
        Insert: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string | null
          forecast_category?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id: number
          period?: string | null
          transaction_amount?: number | null
          year?: number | null
          year_period?: string | null
        }
        Update: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string | null
          forecast_category?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period?: string | null
          transaction_amount?: number | null
          year?: number | null
          year_period?: string | null
        }
        Relationships: []
      }
      hedge_request: {
        Row: {
          base_currency: string | null
          buy_sell: string | null
          buy_sell_amount: number | null
          buy_sell_currency_code: string | null
          created_by: string | null
          currency_pair: string | null
          entity_id: string | null
          entity_name: string | null
          instrument: string | null
          quote_currency: string | null
          settlement_date: string | null
          strategy: string | null
          trade_date: string | null
          trade_request_id: string
        }
        Insert: {
          base_currency?: string | null
          buy_sell?: string | null
          buy_sell_amount?: number | null
          buy_sell_currency_code?: string | null
          created_by?: string | null
          currency_pair?: string | null
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          quote_currency?: string | null
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
          trade_request_id: string
        }
        Update: {
          base_currency?: string | null
          buy_sell?: string | null
          buy_sell_amount?: number | null
          buy_sell_currency_code?: string | null
          created_by?: string | null
          currency_pair?: string | null
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          quote_currency?: string | null
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
          trade_request_id?: string
        }
        Relationships: []
      }
      hedge_strategy: {
        Row: {
          exposure_category_level_2: string | null
          strategy: string | null
          strategy_description: string | null
        }
        Insert: {
          exposure_category_level_2?: string | null
          strategy?: string | null
          strategy_description?: string | null
        }
        Update: {
          exposure_category_level_2?: string | null
          strategy?: string | null
          strategy_description?: string | null
        }
        Relationships: []
      }
      im_actual: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      im_forecast: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      instruments: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      rates: {
        Row: {
          base_currency: string | null
          bs_month: string | null
          closing_rate: number | null
          currency_pair: string | null
          id: number
          pl_month: string | null
          quote_currency: string | null
          rate_date: string | null
          timestamp: string | null
        }
        Insert: {
          base_currency?: string | null
          bs_month?: string | null
          closing_rate?: number | null
          currency_pair?: string | null
          id: number
          pl_month?: string | null
          quote_currency?: string | null
          rate_date?: string | null
          timestamp?: string | null
        }
        Update: {
          base_currency?: string | null
          bs_month?: string | null
          closing_rate?: number | null
          currency_pair?: string | null
          id?: number
          pl_month?: string | null
          quote_currency?: string | null
          rate_date?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      table_connections: {
        Row: {
          column_count: number
          last_update: string
          next_update: string
          record_count: number
          size: string
          status: string
          table_name: string
          type: string
        }
        Insert: {
          column_count: number
          last_update: string
          next_update: string
          record_count: number
          size: string
          status: string
          table_name: string
          type: string
        }
        Update: {
          column_count?: number
          last_update?: string
          next_update?: string
          record_count?: number
          size?: string
          status?: string
          table_name?: string
          type?: string
        }
        Relationships: []
      }
      trade_register: {
        Row: {
          base_currency: string | null
          base_currency_amount: number | null
          buy_sell: string | null
          buy_sell_currency_code: string | null
          contract_rate: number | null
          counterparty: string | null
          currency_pair: string | null
          deal_id: string | null
          entity_id: string | null
          entity_name: string | null
          id: number
          instrument: string | null
          quote_currency: string | null
          quote_currency_amount: string | null
          settlement_date: string | null
          spot_rate: number | null
          strategy: string | null
          ticket_ref: string | null
          trade_date: string | null
        }
        Insert: {
          base_currency?: string | null
          base_currency_amount?: number | null
          buy_sell?: string | null
          buy_sell_currency_code?: string | null
          contract_rate?: number | null
          counterparty?: string | null
          currency_pair?: string | null
          deal_id?: string | null
          entity_id?: string | null
          entity_name?: string | null
          id: number
          instrument?: string | null
          quote_currency?: string | null
          quote_currency_amount?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          strategy?: string | null
          ticket_ref?: string | null
          trade_date?: string | null
        }
        Update: {
          base_currency?: string | null
          base_currency_amount?: number | null
          buy_sell?: string | null
          buy_sell_currency_code?: string | null
          contract_rate?: number | null
          counterparty?: string | null
          currency_pair?: string | null
          deal_id?: string | null
          entity_id?: string | null
          entity_name?: string | null
          id?: number
          instrument?: string | null
          quote_currency?: string | null
          quote_currency_amount?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          strategy?: string | null
          ticket_ref?: string | null
          trade_date?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
