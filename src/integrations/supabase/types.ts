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
          id?: number
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
          id: number
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
          id?: number
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
          id?: number
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
          id?: number
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
      chart_of_accounts: {
        Row: {
          account_category_level_1: string | null
          account_category_level_1_ID: string | null
          account_category_level_2: string | null
          account_category_level_2_ID: string | null
          account_category_level_3: string | null
          account_category_level_3_ID: string | null
          account_category_level_4: string | null
          account_category_level_ID_4: string | null
          account_name: string | null
          account_number: string | null
          currency_code: string | null
          restricted_currency: boolean | null
          revalue_flag: boolean | null
        }
        Insert: {
          account_category_level_1?: string | null
          account_category_level_1_ID?: string | null
          account_category_level_2?: string | null
          account_category_level_2_ID?: string | null
          account_category_level_3?: string | null
          account_category_level_3_ID?: string | null
          account_category_level_4?: string | null
          account_category_level_ID_4?: string | null
          account_name?: string | null
          account_number?: string | null
          currency_code?: string | null
          restricted_currency?: boolean | null
          revalue_flag?: boolean | null
        }
        Update: {
          account_category_level_1?: string | null
          account_category_level_1_ID?: string | null
          account_category_level_2?: string | null
          account_category_level_2_ID?: string | null
          account_category_level_3?: string | null
          account_category_level_3_ID?: string | null
          account_category_level_4?: string | null
          account_category_level_ID_4?: string | null
          account_name?: string | null
          account_number?: string | null
          currency_code?: string | null
          restricted_currency?: boolean | null
          revalue_flag?: boolean | null
        }
        Relationships: []
      }
      config_currencies: {
        Row: {
          entity_id: string
          exposed_currency: string | null
          id: number
        }
        Insert: {
          entity_id: string
          exposed_currency?: string | null
          id?: number
        }
        Update: {
          entity_id?: string
          exposed_currency?: string | null
          id?: number
        }
        Relationships: []
      }
      config_entity: {
        Row: {
          entity_id: string
          entity_name: string
          functional_currency: string | null
          id: number
          rate_method: string | null
        }
        Insert: {
          entity_id: string
          entity_name: string
          functional_currency?: string | null
          id?: number
          rate_method?: string | null
        }
        Update: {
          entity_id?: string
          entity_name?: string
          functional_currency?: string | null
          id?: number
          rate_method?: string | null
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
          id: number
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
          id?: number
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
          id?: number
          monetary_assets?: boolean | null
          monetary_liabilities?: boolean | null
          net_income?: boolean | null
          net_monetary?: boolean | null
          other?: boolean | null
          po?: boolean | null
          revenue?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_config_exposures_entity"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "config_entity"
            referencedColumns: ["entity_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "fk_criteria_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "config_entity"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      entities: {
        Row: {
          accounting_rate_method: string
          created_at: string | null
          entity_id: string
          entity_name: string
          functional_currency: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          accounting_rate_method: string
          created_at?: string | null
          entity_id: string
          entity_name: string
          functional_currency: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          accounting_rate_method?: string
          created_at?: string | null
          entity_id?: string
          entity_name?: string
          functional_currency?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      exposure_categories: {
        Row: {
          category_id: number
          category_level: number
          category_name: string
          is_active: boolean | null
          parent_id: number | null
        }
        Insert: {
          category_id?: number
          category_level: number
          category_name: string
          is_active?: boolean | null
          parent_id?: number | null
        }
        Update: {
          category_id?: number
          category_level?: number
          category_name?: string
          is_active?: boolean | null
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exposure_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "exposure_categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      exposure_types: {
        Row: {
          created_at: string | null
          exposure_category_l1: string
          exposure_category_l2: string
          exposure_category_l3: string
          exposure_type_id: number
          is_active: boolean | null
          subsystem: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          exposure_category_l1: string
          exposure_category_l2: string
          exposure_category_l3: string
          exposure_type_id?: number
          is_active?: boolean | null
          subsystem: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          exposure_category_l1?: string
          exposure_category_l2?: string
          exposure_category_l3?: string
          exposure_type_id?: number
          is_active?: boolean | null
          subsystem?: string
          updated_at?: string | null
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
          id?: number
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
          account_number: string
          base_amount: number | null
          cost_centre: string | null
          country: string | null
          currency: string | null
          entity: string | null
          entity_id: string
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
          period: string
          transaction_amount: number | null
          year: number
          year_period: string | null
        }
        Insert: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number: string
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id: string
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period: string
          transaction_amount?: number | null
          year: number
          year_period?: string | null
        }
        Update: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period?: string
          transaction_amount?: number | null
          year?: number
          year_period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gl_actual_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "config_entity"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      gl_forecast: {
        Row: {
          account_category_level_4: string | null
          account_name: string | null
          account_number: string
          base_amount: number | null
          cost_centre: string | null
          country: string | null
          currency: string | null
          entity: string | null
          entity_id: string
          forecast_category: string
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
          period: string
          transaction_amount: number | null
          year: number
          year_period: string | null
        }
        Insert: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number: string
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id: string
          forecast_category: string
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period: string
          transaction_amount?: number | null
          year: number
          year_period?: string | null
        }
        Update: {
          account_category_level_4?: string | null
          account_name?: string | null
          account_number?: string
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          currency?: string | null
          entity?: string | null
          entity_id?: string
          forecast_category?: string
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          period?: string
          transaction_amount?: number | null
          year?: number
          year_period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gl_forecast_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "config_entity"
            referencedColumns: ["entity_id"]
          },
        ]
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
          id: number
          instrument: string | null
          quote_currency: string | null
          settlement_date: string | null
          strategy: string | null
          trade_date: string | null
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
          id?: number
          instrument?: string | null
          quote_currency?: string | null
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
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
          id?: number
          instrument?: string | null
          quote_currency?: string | null
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
        }
        Relationships: []
      }
      hedge_request_draft: {
        Row: {
          cost_centre: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          entity_id: string | null
          entity_name: string | null
          exposure_category_level_2: string | null
          exposure_category_level_3: string | null
          exposure_category_level_4: string | null
          exposure_config: string | null
          functional_currency: string | null
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: string
          instrument: string | null
          status: string | null
          strategy: string | null
          updated_at: string | null
        }
        Insert: {
          cost_centre?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_level_2?: string | null
          exposure_category_level_3?: string | null
          exposure_category_level_4?: string | null
          exposure_config?: string | null
          functional_currency?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: string
          instrument?: string | null
          status?: string | null
          strategy?: string | null
          updated_at?: string | null
        }
        Update: {
          cost_centre?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_level_2?: string | null
          exposure_category_level_3?: string | null
          exposure_category_level_4?: string | null
          exposure_config?: string | null
          functional_currency?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: string
          instrument?: string | null
          status?: string | null
          strategy?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hedge_request_draft_trades: {
        Row: {
          base_currency: string | null
          buy_sell: string | null
          buy_sell_amount: number | null
          buy_sell_currency_code: string | null
          created_at: string | null
          currency_pair: string | null
          draft_id: string | null
          id: string
          quote_currency: string | null
          settlement_date: string | null
          trade_date: string | null
          updated_at: string | null
        }
        Insert: {
          base_currency?: string | null
          buy_sell?: string | null
          buy_sell_amount?: number | null
          buy_sell_currency_code?: string | null
          created_at?: string | null
          currency_pair?: string | null
          draft_id?: string | null
          id?: string
          quote_currency?: string | null
          settlement_date?: string | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Update: {
          base_currency?: string | null
          buy_sell?: string | null
          buy_sell_amount?: number | null
          buy_sell_currency_code?: string | null
          created_at?: string | null
          currency_pair?: string | null
          draft_id?: string | null
          id?: string
          quote_currency?: string | null
          settlement_date?: string | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hedge_request_draft_trades_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "hedge_request_draft"
            referencedColumns: ["id"]
          },
        ]
      }
      hedge_strategy: {
        Row: {
          exposure_category_level_2: string | null
          id: number
          instrument: string | null
          strategy: string | null
          strategy_description: string | null
        }
        Insert: {
          exposure_category_level_2?: string | null
          id?: number
          instrument?: string | null
          strategy?: string | null
          strategy_description?: string | null
        }
        Update: {
          exposure_category_level_2?: string | null
          id?: number
          instrument?: string | null
          strategy?: string | null
          strategy_description?: string | null
        }
        Relationships: []
      }
      hedge_strategy_criteria_link: {
        Row: {
          criteria_id: number
          exposure_category_level_2: string
          hedge_strategy_id: number
        }
        Insert: {
          criteria_id: number
          exposure_category_level_2: string
          hedge_strategy_id: number
        }
        Update: {
          criteria_id?: number
          exposure_category_level_2?: string
          hedge_strategy_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_criteria"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_hedge_strategy"
            columns: ["hedge_strategy_id"]
            isOneToOne: false
            referencedRelation: "hedge_strategy"
            referencedColumns: ["id"]
          },
        ]
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
      management_structure: {
        Row: {
          cost_centre: string
          country: string | null
          entity_id: string | null
          entity_name: string | null
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
        }
        Insert: {
          cost_centre: string
          country?: string | null
          entity_id?: string | null
          entity_name?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
        }
        Update: {
          cost_centre?: string
          country?: string | null
          entity_id?: string | null
          entity_name?: string | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
        }
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
          id?: number
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
      table_constraints: {
        Row: {
          column_name: unknown | null
          table_name: unknown | null
        }
        Insert: {
          column_name?: unknown | null
          table_name?: unknown | null
        }
        Update: {
          column_name?: unknown | null
          table_name?: unknown | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          character_maximum_length: number | null
          column_default: string | null
          column_name: unknown | null
          data_type: string | null
          is_nullable: string | null
          numeric_precision: number | null
          numeric_scale: number | null
          table_name: unknown | null
        }
        Insert: {
          character_maximum_length?: number | null
          column_default?: string | null
          column_name?: unknown | null
          data_type?: string | null
          is_nullable?: string | null
          numeric_precision?: number | null
          numeric_scale?: number | null
          table_name?: unknown | null
        }
        Update: {
          character_maximum_length?: number | null
          column_default?: string | null
          column_name?: unknown | null
          data_type?: string | null
          is_nullable?: string | null
          numeric_precision?: number | null
          numeric_scale?: number | null
          table_name?: unknown | null
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
      v_entity_config: {
        Row: {
          accounting_rate_method: string | null
          created_at: string | null
          entity_id: string | null
          entity_name: string | null
          functional_currency: string | null
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          accounting_rate_method?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          functional_currency?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          accounting_rate_method?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          functional_currency?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_draft_with_options: {
        Args: {
          draft_id: string
        }
        Returns: Json
      }
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
