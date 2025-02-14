
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import type { HedgeRequestRow, ValidHedgeConfig } from "./types/hedgeRequest.types";

const HedgeRequestGrid = () => {
  const [rowData, setRowData] = useState<HedgeRequestRow>({
    entity_id: "",
    entity_name: "",
    strategy: "",
    instrument: "",
    counterparty: "",
    counterparty_name: "",
    buy_sell: "BUY",
    amount: 0,
    currency: "",
    trade_date: new Date().toISOString().split('T')[0],
    settlement_date: "",
    cost_centre: ""
  });

  // Fetch valid configurations
  const { data: validConfigs } = useQuery({
    queryKey: ['valid-hedge-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_valid_hedge_configurations')
        .select('*')
        .eq('is_assigned', true);
      
      if (error) throw error;
      return data as ValidHedgeConfig[];
    }
  });

  // Get unique entities
  const entities = validConfigs ? [...new Set(validConfigs.map(c => ({
    id: c.entity_id,
    name: c.entity_name
  })))] : [];

  // Get strategies for selected entity
  const strategies = validConfigs ? validConfigs
    .filter(c => c.entity_id === rowData.entity_id)
    .map(c => c.strategy)
    .filter((v, i, a) => a.indexOf(v) === i) : [];

  // Get counterparties for selected strategy
  const counterparties = validConfigs ? validConfigs
    .filter(c => 
      c.entity_id === rowData.entity_id && 
      c.strategy === rowData.strategy
    )
    .map(c => ({
      id: c.counterparty_id,
      name: c.counterparty_name
    })) : [];

  // Get instrument for selected strategy
  const getInstrument = (strategy: string) => {
    return validConfigs?.find(c => 
      c.entity_id === rowData.entity_id && 
      c.strategy === strategy
    )?.instrument || "";
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .insert([{
          entity_id: rowData.entity_id,
          entity_name: rowData.entity_name,
          strategy: rowData.strategy,
          instrument: rowData.instrument,
          counterparty: rowData.counterparty,
          counterparty_name: rowData.counterparty_name,
          ccy_1: rowData.currency,
          ccy_1_amount: rowData.buy_sell === 'BUY' ? rowData.amount : null,
          ccy_2_amount: rowData.buy_sell === 'SELL' ? rowData.amount : null,
          trade_date: rowData.trade_date,
          settlement_date: rowData.settlement_date,
          cost_centre: rowData.cost_centre,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Trade request saved successfully');
    } catch (error) {
      console.error('Error saving trade request:', error);
      toast.error('Failed to save trade request');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Entity Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Entity</label>
          <Select
            value={rowData.entity_id}
            onValueChange={(value) => {
              const entity = entities.find(e => e.id === value);
              setRowData({
                ...rowData,
                entity_id: value,
                entity_name: entity?.name || '',
                strategy: '',
                instrument: '',
                counterparty: '',
                counterparty_name: ''
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Entity" />
            </SelectTrigger>
            <SelectContent>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <Select
            value={rowData.strategy}
            onValueChange={(value) => {
              setRowData({
                ...rowData,
                strategy: value,
                instrument: getInstrument(value),
                counterparty: '',
                counterparty_name: ''
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Counterparty Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Counterparty</label>
          <Select
            value={rowData.counterparty}
            onValueChange={(value) => {
              const counterparty = counterparties.find(c => c.id === value);
              setRowData({
                ...rowData,
                counterparty: value,
                counterparty_name: counterparty?.name || ''
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Counterparty" />
            </SelectTrigger>
            <SelectContent>
              {counterparties.map((cp) => (
                <SelectItem key={cp.id} value={cp.id}>
                  {cp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instrument (Read-only) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Instrument</label>
          <Input 
            value={rowData.instrument} 
            readOnly 
            className="bg-gray-50"
          />
        </div>

        {/* Buy/Sell Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Buy/Sell</label>
          <Select
            value={rowData.buy_sell}
            onValueChange={(value: 'BUY' | 'SELL') => {
              setRowData({
                ...rowData,
                buy_sell: value
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUY">Buy</SelectItem>
              <SelectItem value="SELL">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            value={rowData.amount}
            onChange={(e) => setRowData({
              ...rowData,
              amount: parseFloat(e.target.value) || 0
            })}
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Input
            value={rowData.currency}
            onChange={(e) => setRowData({
              ...rowData,
              currency: e.target.value
            })}
          />
        </div>

        {/* Trade Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trade Date</label>
          <Input
            type="date"
            value={rowData.trade_date}
            onChange={(e) => setRowData({
              ...rowData,
              trade_date: e.target.value
            })}
          />
        </div>

        {/* Settlement Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Settlement Date</label>
          <Input
            type="date"
            value={rowData.settlement_date}
            onChange={(e) => setRowData({
              ...rowData,
              settlement_date: e.target.value
            })}
          />
        </div>

        {/* Cost Centre */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Cost Centre</label>
          <Input
            value={rowData.cost_centre}
            onChange={(e) => setRowData({
              ...rowData,
              cost_centre: e.target.value
            })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Trade Request
        </Button>
      </div>
    </div>
  );
};

export default HedgeRequestGrid;
