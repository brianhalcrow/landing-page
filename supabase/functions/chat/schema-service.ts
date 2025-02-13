
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface SchemaInfo {
  column: string;
  type: string;
  nullable: string;
  default: string | null;
}

export interface SchemaByTable {
  [key: string]: SchemaInfo[];
}

export async function getSchemaContext(supabase: ReturnType<typeof createClient>) {
  const { data: tableSchema, error: schemaError } = await supabase
    .from('tables')
    .select('table_name, column_name, data_type, is_nullable, column_default')
    .order('table_name');

  if (schemaError) {
    console.error('Error fetching schema:', schemaError);
    throw schemaError;
  }

  // Organize schema information by table
  const schemaByTable = tableSchema.reduce((acc: SchemaByTable, curr) => {
    if (!acc[curr.table_name]) {
      acc[curr.table_name] = [];
    }
    acc[curr.table_name].push({
      column: curr.column_name,
      type: curr.data_type,
      nullable: curr.is_nullable,
      default: curr.column_default
    });
    return acc;
  }, {});

  // Create schema context
  return Object.entries(schemaByTable)
    .map(([table, columns]) => 
      `Table ${table}:\n${columns
        .map(col => `- ${col.column} (${col.type}${col.nullable === 'YES' ? ', nullable' : ''}${col.default ? `, default: ${col.default}` : ''})`)
        .join('\n')}`
    )
    .join('\n\n');
}
