
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface EntityData {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
}

interface EntityCounterparty {
  entity_id: string;
  counterparty_id: string;
  relationship_id: string;
}

const GeneralInformationSection = () => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [exposedCurrency, setExposedCurrency] = useState("");
  const [selectedHedgingEntity, setSelectedHedgingEntity] = useState("");
  const [hedgingEntityFunctionalCurrency, setHedgingEntityFunctionalCurrency] = useState("");

  // Fetch entity data
  const { data: entities } = useQuery({
    queryKey: ['legal-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_legal_entity')
        .select('entity_id, entity_name, functional_currency');
      
      if (error) throw error;
      console.log('All entities:', data);
      return data as EntityData[];
    }
  });

  // Fetch entity counterparty relationships
  const { data: entityCounterparty, isSuccess: isRelationshipsFetched } = useQuery({
    queryKey: ['entity-counterparty', selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return null;
      const { data, error } = await supabase
        .from('entity_counterparty')
        .select('*')
        .eq('entity_id', selectedEntityId)
        .eq('counterparty_id', 'SEN1');
      
      if (error) throw error;
      console.log('Entity-SEN1 relationship data:', data);
      return data as EntityCounterparty[];
    },
    enabled: !!selectedEntityId
  });

  // Fetch available currencies
  const { data: currencies } = useQuery({
    queryKey: ['available-currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_rates_monthly')
        .select('quote_currency')
        .limit(1000);
      
      if (error) throw error;
      
      const uniqueCurrencies = [...new Set(data.map(row => row.quote_currency))];
      return uniqueCurrencies.sort();
    }
  });

  // Find entity by ID or name
  const selectedEntity = entities?.find(e => 
    e.entity_id === selectedEntityId || e.entity_name === selectedEntityName
  );

  // Get available hedging entities
  const getHedgingEntityOptions = () => {
    console.log('Getting hedging entity options...');
    console.log('Selected entity:', selectedEntity);
    console.log('Entity counterparty:', entityCounterparty);
    console.log('All available entities:', entities);

    if (!selectedEntity || !entities) return [];
    
    // Start with the selected entity
    const options = [selectedEntity];
    
    // If there's a relationship with SEN1, add Sense Treasury B.V.
    if (entityCounterparty && entityCounterparty.length > 0) {
      // Look for Sense Treasury B.V. case-insensitive
      const senseTreasury = entities.find(e => 
        e.entity_name.toLowerCase().includes('treasury')
      );
      
      console.log('Found Sense Treasury:', senseTreasury);
      
      if (senseTreasury && !options.some(e => e.entity_id === senseTreasury.entity_id)) {
        options.push(senseTreasury);
      }
    }
    
    console.log('Final hedging entity options:', options);
    return options;
  };

  // Update both ID and name when either changes
  const handleEntityIdChange = (newId: string) => {
    console.log('Entity ID changed to:', newId);
    setSelectedEntityId(newId);
    const entity = entities?.find(e => e.entity_id === newId);
    if (entity) {
      setSelectedEntityName(entity.entity_name);
      setSelectedHedgingEntity(entity.entity_name);
    }
  };

  const handleEntityNameChange = (newName: string) => {
    console.log('Entity name changed to:', newName);
    setSelectedEntityName(newName);
    const entity = entities?.find(e => e.entity_name === newName);
    if (entity) {
      setSelectedEntityId(entity.entity_id);
      setSelectedHedgingEntity(newName);
    }
  };

  const handleHedgingEntityChange = (newEntityName: string) => {
    console.log('Hedging entity changed to:', newEntityName);
    setSelectedHedgingEntity(newEntityName);
    const hedgingEntity = entities?.find(e => e.entity_name === newEntityName);
    if (hedgingEntity) {
      setHedgingEntityFunctionalCurrency(hedgingEntity.functional_currency);
    }
  };

  // Set initial hedging entity functional currency when hedging entity changes
  useEffect(() => {
    if (selectedHedgingEntity && entities) {
      const hedgingEntity = entities.find(e => e.entity_name === selectedHedgingEntity);
      if (hedgingEntity) {
        setHedgingEntityFunctionalCurrency(hedgingEntity.functional_currency);
      }
    }
  }, [selectedHedgingEntity, entities]);

  return (
    <div className="grid grid-cols-5 gap-4">
      {/* Row 1 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Entity Name</label>
        <Select value={selectedEntityName} onValueChange={handleEntityNameChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            {entities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_name}>
                {entity.entity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Entity ID</label>
        <Select value={selectedEntityId} onValueChange={handleEntityIdChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity ID" />
          </SelectTrigger>
          <SelectContent>
            {entities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_id}>
                {entity.entity_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Functional Currency</label>
        <Input 
          type="text" 
          value={selectedEntity?.functional_currency || ''} 
          disabled
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposed Currency</label>
        <Select value={exposedCurrency} onValueChange={setExposedCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies?.map(currency => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Documentation Date</label>
        <Input type="date" />
      </div>

      {/* Row 2 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge ID</label>
        <Input type="text" placeholder="Enter hedge ID" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Risk Type</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select risk type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fx">Foreign Exchange</SelectItem>
            <SelectItem value="ir">Interest Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge Type</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select hedge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cashflow">Cashflow</SelectItem>
            <SelectItem value="fair-value">Fair Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity</label>
        <Select value={selectedHedgingEntity} onValueChange={handleHedgingEntityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select hedging entity" />
          </SelectTrigger>
          <SelectContent>
            {getHedgingEntityOptions().map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_name}>
                {entity.entity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity Functional Currency</label>
        <Input 
          type="text" 
          value={hedgingEntityFunctionalCurrency} 
          disabled
          className="bg-gray-100"
        />
      </div>
    </div>
  );
};

export default GeneralInformationSection;
