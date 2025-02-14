
import { Skeleton } from "@/components/ui/skeleton";
import { useCounterpartiesGrid } from "./hooks/useCounterpartiesGrid";
import { CounterpartiesGridContent } from "./components/CounterpartiesGridContent";

const CounterpartiesGrid = () => {
  const {
    counterparties,
    gridData,
    isLoading,
    editingRows,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
  } = useCounterpartiesGrid();

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <CounterpartiesGridContent
      gridData={gridData}
      counterparties={counterparties}
      editingRows={editingRows}
      pendingChanges={pendingChanges}
      setPendingChanges={setPendingChanges}
      onEditClick={handleEditClick}
      onSaveClick={handleSaveClick}
    />
  );
};

export default CounterpartiesGrid;
