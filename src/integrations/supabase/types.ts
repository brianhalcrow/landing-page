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
      chart_preferences: {
        Row: {
          chart_id: string
          created_at: string
          height: number | null
          id: number
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          chart_id: string
          created_at?: string
          height?: number | null
          id?: number
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          chart_id?: string
          created_at?: string
          height?: number | null
          id?: number
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
        }
        Relationships: []
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
      entity_exposure_config: {
        Row: {
          created_at: string | null
          entity_id: string
          exposure_type_id: number
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          exposure_type_id: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          exposure_type_id?: number
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_exposure_config_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "entity_exposure_config_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "v_entity_config"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "entity_exposure_config_exposure_type_id_fkey"
            columns: ["exposure_type_id"]
            isOneToOne: false
            referencedRelation: "exposure_types"
            referencedColumns: ["exposure_type_id"]
          },
        ]
      }
      erp_ap_module: {
        Row: {
          cost_centre: string | null
          country_currency_id: number | null
          created_date: string | null
          description: string | null
          due_date: string | null
          entity_name: string | null
          geo_structure_entity_id: number | null
          id: number | null
          invoice_date: string
          invoice_id: string
          legal_entity_id: string | null
          paid_date: string | null
          payment_terms_days: number | null
          po_id: string | null
          subsystem_code: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          transaction_currency: string
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number | null
          created_date?: string | null
          description?: string | null
          due_date?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: number | null
          id?: number | null
          invoice_date: string
          invoice_id: string
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          transaction_currency: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number | null
          created_date?: string | null
          description?: string | null
          due_date?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: number | null
          id?: number | null
          invoice_date?: string
          invoice_id?: string
          legal_entity_id?: string | null
          paid_date?: string | null
          payment_terms_days?: number | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          transaction_currency?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: []
      }
      erp_ar_module: {
        Row: {
          cost_centre: string | null
          country_currency_id: number
          customer_id: string | null
          customer_name: string | null
          description: string | null
          due_date: string | null
          entity_name: string | null
          geo_structure_entity_id: string | null
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
          transaction_currency: string | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          due_date?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: string | null
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
          transaction_currency?: string | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          due_date?: string | null
          entity_name?: string | null
          geo_structure_entity_id?: string | null
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
          transaction_currency?: string | null
        }
        Relationships: []
      }
      erp_gl_transactions: {
        Row: {
          account_category_l1: string | null
          account_category_l2: string | null
          account_category_l3: string | null
          account_category_l4: string | null
          account_name: string | null
          account_number: string | null
          ap_invoice_id: string | null
          ar_invoice_id: string | null
          base_amount: number | null
          cost_centre: string | null
          country: string | null
          created_by: string | null
          customer_id: string | null
          customer_name: string | null
          daily_exchange_rate: number | null
          delivery_date: string | null
          description: string | null
          doc_header_desc: string | null
          document_date: string | null
          document_type: string | null
          entity: string | null
          entity_id: number | null
          geo_level_1: string | null
          geo_level_2: string | null
          geo_level_3: string | null
          id: number
          je_id: string | null
          je_line_id: string | null
          monthly_exchange_rate: number | null
          period: string | null
          po_id: string | null
          revalue_flag: boolean | null
          subsystem_code: string | null
          transaction_amount: number | null
          transaction_currency: string | null
          vendor_id: string | null
          vendor_name: string | null
          year: number | null
          year_period: string | null
        }
        Insert: {
          account_category_l1?: string | null
          account_category_l2?: string | null
          account_category_l3?: string | null
          account_category_l4?: string | null
          account_name?: string | null
          account_number?: string | null
          ap_invoice_id?: string | null
          ar_invoice_id?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_name?: string | null
          daily_exchange_rate?: number | null
          delivery_date?: string | null
          description?: string | null
          doc_header_desc?: string | null
          document_date?: string | null
          document_type?: string | null
          entity?: string | null
          entity_id?: number | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          je_id?: string | null
          je_line_id?: string | null
          monthly_exchange_rate?: number | null
          period?: string | null
          po_id?: string | null
          revalue_flag?: boolean | null
          subsystem_code?: string | null
          transaction_amount?: number | null
          transaction_currency?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
          year?: number | null
          year_period?: string | null
        }
        Update: {
          account_category_l1?: string | null
          account_category_l2?: string | null
          account_category_l3?: string | null
          account_category_l4?: string | null
          account_name?: string | null
          account_number?: string | null
          ap_invoice_id?: string | null
          ar_invoice_id?: string | null
          base_amount?: number | null
          cost_centre?: string | null
          country?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_name?: string | null
          daily_exchange_rate?: number | null
          delivery_date?: string | null
          description?: string | null
          doc_header_desc?: string | null
          document_date?: string | null
          document_type?: string | null
          entity?: string | null
          entity_id?: number | null
          geo_level_1?: string | null
          geo_level_2?: string | null
          geo_level_3?: string | null
          id?: number
          je_id?: string | null
          je_line_id?: string | null
          monthly_exchange_rate?: number | null
          period?: string | null
          po_id?: string | null
          revalue_flag?: boolean | null
          subsystem_code?: string | null
          transaction_amount?: number | null
          transaction_currency?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
          year?: number | null
          year_period?: string | null
        }
        Relationships: []
      }
      erp_po_module: {
        Row: {
          cost_centre: string | null
          country_currency_id: number
          delivery_date: string | null
          description: string | null
          entity_name: string | null
          expected_delivery_date: string | null
          geo_structure_entity_id: string | null
          id: number
          legal_entity_id: string | null
          po_date: string | null
          po_date_time: string | null
          po_id: string | null
          subsystem_code: string | null
          subtotal: number | null
          transaction_currency: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          cost_centre?: string | null
          country_currency_id?: number
          delivery_date?: string | null
          description?: string | null
          entity_name?: string | null
          expected_delivery_date?: string | null
          geo_structure_entity_id?: string | null
          id?: number
          legal_entity_id?: string | null
          po_date?: string | null
          po_date_time?: string | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          transaction_currency?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          cost_centre?: string | null
          country_currency_id?: number
          delivery_date?: string | null
          description?: string | null
          entity_name?: string | null
          expected_delivery_date?: string | null
          geo_structure_entity_id?: string | null
          id?: number
          legal_entity_id?: string | null
          po_date?: string | null
          po_date_time?: string | null
          po_id?: string | null
          subsystem_code?: string | null
          subtotal?: number | null
          transaction_currency?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      hedge_request_draft: {
        Row: {
          cost_centre: string | null
          created_at: string | null
          created_by: string | null
          entity_id: string | null
          entity_name: string | null
          exposure_category_l1: string | null
          exposure_category_l2: string | null
          exposure_category_l3: string | null
          functional_currency: string | null
          id: number
          instrument: string | null
          status: string | null
          strategy_description: string | null
          updated_at: string | null
        }
        Insert: {
          cost_centre?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_l1?: string | null
          exposure_category_l2?: string | null
          exposure_category_l3?: string | null
          functional_currency?: string | null
          id?: number
          instrument?: string | null
          status?: string | null
          strategy_description?: string | null
          updated_at?: string | null
        }
        Update: {
          cost_centre?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          exposure_category_l1?: string | null
          exposure_category_l2?: string | null
          exposure_category_l3?: string | null
          functional_currency?: string | null
          id?: number
          instrument?: string | null
          status?: string | null
          strategy_description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hedge_request_draft_trades: {
        Row: {
          buy_amount: number | null
          buy_currency: string | null
          contract_rate: number | null
          created_at: string | null
          draft_id: string | null
          entity_id: string | null
          entity_name: string | null
          id: number
          sell_amount: number | null
          sell_currency: string | null
          settlement_date: string | null
          spot_rate: number | null
          trade_date: string | null
          updated_at: string | null
        }
        Insert: {
          buy_amount?: number | null
          buy_currency?: string | null
          contract_rate?: number | null
          created_at?: string | null
          draft_id?: string | null
          entity_id?: string | null
          entity_name?: string | null
          id?: number
          sell_amount?: number | null
          sell_currency?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Update: {
          buy_amount?: number | null
          buy_currency?: string | null
          contract_rate?: number | null
          created_at?: string | null
          draft_id?: string | null
          entity_id?: string | null
          entity_name?: string | null
          id?: number
          sell_amount?: number | null
          sell_currency?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hedge_strategy: {
        Row: {
          exposure_category_l2: string | null
          id: number
          instrument: string | null
          strategy: string | null
          strategy_description: string | null
        }
        Insert: {
          exposure_category_l2?: string | null
          id?: number
          instrument?: string | null
          strategy?: string | null
          strategy_description?: string | null
        }
        Update: {
          exposure_category_l2?: string | null
          id?: number
          instrument?: string | null
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
        Row: {
          id: number
          instrument: string | null
        }
        Insert: {
          id?: number
          instrument?: string | null
        }
        Update: {
          id?: number
          instrument?: string | null
        }
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
      pipeline_executions: {
        Row: {
          created_at: string | null
          end_time: string | null
          error_message: string | null
          id: number
          pipeline_name: string
          records_processed: number | null
          source_system: string
          start_time: string | null
          status: string
          target_table: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          error_message?: string | null
          id?: number
          pipeline_name: string
          records_processed?: number | null
          source_system: string
          start_time?: string | null
          status: string
          target_table: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          error_message?: string | null
          id?: number
          pipeline_name?: string
          records_processed?: number | null
          source_system?: string
          start_time?: string | null
          status?: string
          target_table?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pre_trade_rates_forward_curves: {
        Row: {
          ask: number | null
          bid: number | null
          change: number | null
          date: string | null
          high: number | null
          id: number | null
          low: number | null
          symbol: string | null
          tenor: string | null
          time: string | null
        }
        Insert: {
          ask?: number | null
          bid?: number | null
          change?: number | null
          date?: string | null
          high?: number | null
          id?: number | null
          low?: number | null
          symbol?: string | null
          tenor?: string | null
          time?: string | null
        }
        Update: {
          ask?: number | null
          bid?: number | null
          change?: number | null
          date?: string | null
          high?: number | null
          id?: number | null
          low?: number | null
          symbol?: string | null
          tenor?: string | null
          time?: string | null
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
          ccy_1: string | null
          ccy_1_amount: number | null
          ccy_2: string | null
          ccy_2_amount: number | null
          contract_rate: number | null
          counterparty: string | null
          created_at: string | null
          created_by: string | null
          currency_pair: string | null
          deal_no: number
          entity_id: string | null
          entity_name: string | null
          instrument: string | null
          settlement_date: string | null
          spot_rate: number | null
          strategy: string | null
          trade_date: string | null
          updated_at: string | null
        }
        Insert: {
          ccy_1?: string | null
          ccy_1_amount?: number | null
          ccy_2?: string | null
          ccy_2_amount?: number | null
          contract_rate?: number | null
          counterparty?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_pair?: string | null
          deal_no?: number
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          strategy?: string | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Update: {
          ccy_1?: string | null
          ccy_1_amount?: number | null
          ccy_2?: string | null
          ccy_2_amount?: number | null
          contract_rate?: number | null
          counterparty?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_pair?: string | null
          deal_no?: number
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          settlement_date?: string | null
          spot_rate?: number | null
          strategy?: string | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trade_requests: {
        Row: {
          ccy_1: string | null
          ccy_1_amount: number | null
          ccy_2: string | null
          ccy_2_amount: number | null
          ccy_pair: string | null
          created_at: string | null
          created_by: string | null
          entity_id: string | null
          entity_name: string | null
          instrument: string | null
          request_no: number
          settlement_date: string | null
          strategy: string | null
          trade_date: string | null
          updated_at: string | null
        }
        Insert: {
          ccy_1?: string | null
          ccy_1_amount?: number | null
          ccy_2?: string | null
          ccy_2_amount?: number | null
          ccy_pair?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          request_no?: number
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
          updated_at?: string | null
        }
        Update: {
          ccy_1?: string | null
          ccy_1_amount?: number | null
          ccy_2?: string | null
          ccy_2_amount?: number | null
          ccy_pair?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_id?: string | null
          entity_name?: string | null
          instrument?: string | null
          request_no?: number
          settlement_date?: string | null
          strategy?: string | null
          trade_date?: string | null
          updated_at?: string | null
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
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      execute_sql_query: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      get_draft_with_options: {
        Args: {
          draft_id: string
        }
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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
