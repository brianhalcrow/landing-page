
import { useQuery } from "@tanstack/react-query";
import { EntitySelector } from "./EntitySelector";
import { EntityActions } from "./EntityActions";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface EntityData {
  entityName: string;
  entityId: string;
  functionalCurrency: string;
}

interface GridInstance {
  selectedEntity: string;
  selectedEntityId: string;
  functionalCurrency: string;
}

export const BalanceSheetContent = () => {
  const [gridInstances, setGridInstances] = useState<GridInstance[]>([
    {
      selectedEntity: "",
      selectedEntityId: "",
      functionalCurrency: "",
    },
  ]);

  const { data: entityData = [], isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      // Placeholder for actual API call
      return [] as EntityData[];
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching entities",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
      }
    }
  });

  const handleEntityChange = (value: string, index: number) => {
    const entity = entityData.find((e: EntityData) => e.entityName === value);
    if (entity) {
      const newGridInstances = [...gridInstances];
      newGridInstances[index] = {
        selectedEntity: value,
        selectedEntityId: entity.entityId,
        functionalCurrency: entity.functionalCurrency,
      };
      setGridInstances(newGridInstances);
    }
  };

  const handleEntityIdChange = (value: string, index: number) => {
    const entity = entityData.find((e: EntityData) => e.entityId === value);
    if (entity) {
      const newGridInstances = [...gridInstances];
      newGridInstances[index] = {
        selectedEntity: entity.entityName,
        selectedEntityId: value,
        functionalCurrency: entity.functionalCurrency,
      };
      setGridInstances(newGridInstances);
    }
  };

  const addNewGrid = (index: number) => {
    const newGridInstances = [...gridInstances];
    newGridInstances.splice(index + 1, 0, {
      selectedEntity: "",
      selectedEntityId: "",
      functionalCurrency: "",
    });
    setGridInstances(newGridInstances);
  };

  const deleteGrid = (index: number) => {
    if (gridInstances.length > 1) {
      const newGridInstances = gridInstances.filter((_, i) => i !== index);
      setGridInstances(newGridInstances);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading entities...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading entities</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Monetary Exposure / Hedge P&L Model
      </h1>
      {gridInstances.map((instance, index) => (
        <div key={index} className="mb-12">
          <EntitySelector
            instance={instance}
            entityData={entityData}
            index={index}
            onEntityChange={handleEntityChange}
            onEntityIdChange={handleEntityIdChange}
          />
          <div className="p-4 bg-gray-100 rounded mt-4">
            Grid implementation coming soon...
          </div>
          <EntityActions
            onAddGrid={addNewGrid}
            onDeleteGrid={deleteGrid}
            index={index}
            isDeleteDisabled={gridInstances.length <= 1}
          />
        </div>
      ))}
    </div>
  );
};
