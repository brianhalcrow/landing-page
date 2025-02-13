
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ValueSetterParams } from "ag-grid-community";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  description: string | null;
  is_active: boolean;
}

const EntityGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  const { data: entities, isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order("entity_name");

      if (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to fetch entities");
        throw error;
      }

      return data || [];
    },
  });

  const updateEntityMutation = useMutation({
    mutationFn: async (entity: Entity) => {
      const { error } = await supabase
        .from("entities")
        .update({
          entity_name: entity.entity_name,
          functional_currency: entity.functional_currency,
          description: entity.description,
          is_active: entity.is_active,
        })
        .eq("entity_id", entity.entity_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      toast.success("Entity updated successfully");
    },
    onError: (error) => {
      console.error("Error updating entity:", error);
      toast.error("Failed to update entity");
    },
  });

  const addEntityMutation = useMutation({
    mutationFn: async (entity: Omit<Entity, "entity_id">) => {
      const { error } = await supabase.from("entities").insert([
        {
          ...entity,
          entity_id: crypto.randomUUID(), // Generate a unique ID
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      toast.success("Entity added successfully");
    },
    onError: (error) => {
      console.error("Error adding entity:", error);
      toast.error("Failed to add entity");
    },
  });

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "entity_id",
      headerName: "Entity ID",
      sortable: true,
      filter: true,
      width: 130,
      editable: false,
    },
    {
      field: "entity_name",
      headerName: "Entity Name",
      sortable: true,
      filter: true,
      flex: 1,
      editable: true,
      valueSetter: (params: ValueSetterParams) => {
        const oldData = { ...params.data };
        oldData[params.colDef.field!] = params.newValue;
        updateEntityMutation.mutate(oldData);
        return true;
      },
    },
    {
      field: "functional_currency",
      headerName: "Functional Currency",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      valueSetter: (params: ValueSetterParams) => {
        const oldData = { ...params.data };
        oldData[params.colDef.field!] = params.newValue;
        updateEntityMutation.mutate(oldData);
        return true;
      },
    },
    {
      field: "description",
      headerName: "Description",
      sortable: true,
      filter: true,
      flex: 1,
      editable: true,
      valueSetter: (params: ValueSetterParams) => {
        const oldData = { ...params.data };
        oldData[params.colDef.field!] = params.newValue;
        updateEntityMutation.mutate(oldData);
        return true;
      },
    },
    {
      field: "is_active",
      headerName: "Status",
      sortable: true,
      filter: true,
      width: 120,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center">
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              params.value
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {params.value ? "Active" : "Inactive"}
          </div>
        </div>
      ),
      valueSetter: (params: ValueSetterParams) => {
        const oldData = { ...params.data };
        oldData[params.colDef.field!] = params.newValue;
        updateEntityMutation.mutate(oldData);
        return true;
      },
    },
  ]);

  const handleAddNewEntity = () => {
    const newEntity = {
      entity_name: "New Entity",
      functional_currency: "USD",
      description: "",
      is_active: true,
    };
    addEntityMutation.mutate(newEntity);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNewEntity}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </Button>
      </div>
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={entities}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
          }}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default EntityGrid;
