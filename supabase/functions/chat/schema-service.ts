
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function getSchemaContext(supabase: ReturnType<typeof createClient>): Promise<string> {
  try {
    // Call our new function to get the live schema
    const { data: schemaData, error } = await supabase.rpc('get_live_schema')
    
    if (error) {
      console.error('Error fetching schema:', error)
      throw error
    }

    if (!schemaData) {
      console.warn('No schema data returned')
      return 'No schema information available'
    }

    // Format the schema information into a readable context
    return schemaData.map((table: any) => {
      const tableName = table.table_name
      const columns = table.columns.map((col: any) => {
        return `- ${col.column_name} (${col.data_type}${col.is_nullable === 'YES' ? ', nullable' : ''}${col.column_default ? `, default: ${col.column_default}` : ''})`
      }).join('\n')
      
      return `Table ${tableName}:\n${columns}`
    }).join('\n\n')

  } catch (error) {
    console.error('Error in getSchemaContext:', error)
    throw error
  }
}
