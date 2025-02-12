
import { useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import type { ColumnState } from 'ag-grid-community';

export const useGridPreferences = (gridRef: React.RefObject<AgGridReact>, gridId: string) => {
  const saveColumnState = useCallback(async () => {
    if (!gridRef.current?.api) return;

    const columnState = gridRef.current.api.getColumnState();
    const columnStateJson = columnState.map(state => ({
      ...state,
      sortIndex: state.sortIndex || null,
      width: state.width || null,
      flex: state.flex || null
    }));
    
    try {
      const { error } = await supabase
        .from('grid_preferences')
        .upsert({
          grid_id: gridId,
          column_state: columnStateJson as any
        }, {
          onConflict: 'grid_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving column state:', error);
      toast.error('Failed to save grid preferences');
    }
  }, [gridRef, gridId]);

  const loadColumnState = useCallback(async () => {
    if (!gridRef.current?.api) return;

    try {
      const { data, error } = await supabase
        .from('grid_preferences')
        .select('column_state')
        .eq('grid_id', gridId)
        .single();

      if (error) throw error;

      if (data?.column_state) {
        const columnState = (data.column_state as any[]).map(state => ({
          colId: state.colId,
          hide: state.hide || false,
          width: state.width || undefined,
          flex: state.flex || undefined,
          sort: state.sort || undefined,
          sortIndex: state.sortIndex || undefined,
          pinned: state.pinned || undefined,
          rowGroup: state.rowGroup || false,
          rowGroupIndex: state.rowGroupIndex || undefined,
          pivot: state.pivot || false,
          pivotIndex: state.pivotIndex || undefined,
          aggFunc: state.aggFunc || undefined
        })) as ColumnState[];

        gridRef.current.api.applyColumnState({
          state: columnState,
          applyOrder: true
        });
      }
    } catch (error) {
      console.error('Error loading column state:', error);
    }
  }, [gridRef, gridId]);

  return {
    saveColumnState,
    loadColumnState
  };
};
