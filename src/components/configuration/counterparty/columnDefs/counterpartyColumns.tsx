import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import ActionsCellRenderer from "../../grid/ActionsCellRenderer";
import { Counterparty } from "../types/counterpartyTypes";

export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: "entity_id",
    headerName: "Entity ID",
    sortable: true,
    filter: true,
    width: 120,
    headerClass: "header-left header-wrap",
    cellClass: "cell-left",
    pinned: "left",
  },
  {
    field: "entity_name",
    headerName: "Entity Name",
    sortable: true,
    filter: true,
    width: 200,
    headerClass: "header-left header-wrap",
    cellClass: "cell-left",
    pinned: "left",
  },
];

export const createCounterpartyColumns = (
  counterparties: Counterparty[],
  editingRows: Record<string, boolean>,
  pendingChanges: Record<string, Record<string, boolean>>,
  setPendingChanges: (changes: Record<string, Record<string, boolean>>) => void
): ColGroupDef[] => {
  // Filter out IHB counterparties
  const eligibleCounterparties = counterparties.filter((cp) => !cp.ihb);

  // First group by type, then by country
  const groupedCounterparties = eligibleCounterparties.reduce(
    (acc, counterparty) => {
      const type = counterparty.counterparty_type || "External";
      const country = counterparty.country || "Other";

      if (!acc[type]) {
        acc[type] = {};
      }
      if (!acc[type][country]) {
        acc[type][country] = [];
      }
      acc[type][country].push(counterparty);
      return acc;
    },
    {} as Record<string, Record<string, Counterparty[]>>
  );

  // Create nested column groups
  const typeGroups = Object.entries(groupedCounterparties).map(
    ([type, countriesMap]) => ({
      headerName: type,
      headerClass: "header-center",
      children: Object.entries(countriesMap).map(
        ([country, countryCounterparties]) => ({
          headerName: country,
          headerClass: "header-center",
          children: countryCounterparties.map((counterparty) => ({
            field: `relationships.${counterparty.counterparty_id}`,
            headerName:
              counterparty.counterparty_name || counterparty.counterparty_id,
            headerClass: "header-center header-wrap",
            cellClass: "cell-center",
            width: 150,
            cellRenderer: CheckboxCellRenderer,
            cellRendererParams: {
              disabled: (params: any) => !editingRows[params.data?.entity_id],
              getValue: function () {
                if (!this?.data?.entity_id) return false;

                const entityId = this.data.entity_id;
                const counterpartyId = counterparty.counterparty_id;

                if (pendingChanges[entityId]?.[counterpartyId] !== undefined) {
                  return pendingChanges[entityId][counterpartyId];
                }
                return this.data.relationships?.[counterpartyId] || false;
              },
              onChange: (isChecked: boolean, data: any) => {
                if (!data?.entity_id) return;

                const entityId = data.entity_id;
                setPendingChanges({
                  ...pendingChanges,
                  [entityId]: {
                    ...pendingChanges[entityId],
                    [counterparty.counterparty_id]: isChecked,
                  },
                });
              },
            },
          })),
        })
      ),
    })
  );

  // Reorder to put Internal type first
  return typeGroups.sort((a, b) => {
    if (a.headerName === "Internal") return -1;
    if (b.headerName === "Internal") return 1;
    return 0;
  });
};
