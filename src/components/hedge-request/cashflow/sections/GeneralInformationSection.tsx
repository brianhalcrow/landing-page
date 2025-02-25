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

interface ExposureCategory {
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
}

const GeneralInformationSection = () => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [exposedCurrency, setExposedCurrency] = useState("");
  const [selectedHedgingEntity, setSelectedHedgingEntity] = useState("");
  const [hedgingEntityFunctionalCurrency, setHedgingEntityFunctionalCurrency] = useState("");
  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState("");
  const [selectedExposureCategoryL3, setSelectedExposureCategoryL3] = useState("");

  // Fetch entity data
  const { data: entities } = useQuery({
    queryKey: ['legal-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_legal_entity')
        .select('entity_id, entity_name, functional_currency');
      
      if (error) throw error;
      return data as EntityData[];
    }
  });

  // Fetch entity exposure categories
  const { data: exposureCategories } = useQuery({
    queryKey: ['entity-exposure-categories', selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return null;
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          exposure_types (
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('entity_id', selectedEntityId)
        .eq('is_active', true);
      
      if (error) throw error;
      
      // Extract unique exposure categories
      const categories = data
        ?.map(config => config.exposure_types)
        .filter(type => type.exposure_category_l1 === 'Transaction'); // Filter for Transaction type

      console.log('Exposure categories:', categories);
      return categories as ExposureCategory[];
    },
    enabled: !!selectedEntityId
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

  // Effect to set default hedging entity when relationships are fetched
  useEffect(() => {
    if (isRelationshipsFetched && entityCounterparty && entities) {
      const treasuryEntity = entities.find(e => e.entity_id === 'NL01');
      if (entityCounterparty.length > 0 && treasuryEntity) {
        setSelectedHedgingEntity(treasuryEntity.entity_name);
        setHedgingEntityFunctionalCurrency(treasuryEntity.functional_currency);
      } else {
        // If no SEN1 relationship or no treasury entity, default to selected entity
        const entity = entities.find(e => e.entity_id === selectedEntityId);
        if (entity) {
          setSelectedHedgingEntity(entity.entity_name);
          setHedgingEntityFunctionalCurrency(entity.functional_currency);
        }
      }
    }
  }, [entityCounterparty, isRelationshipsFetched, entities, selectedEntityId]);

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
    if (!selectedEntity || !entities) return [];
    
    // Find NL01/Sense Treasury entity
    const treasuryEntity = entities.find(e => e.entity_id === 'NL01');
    let options = [];
    
    // If there's a relationship with SEN1 and treasury entity exists, make it the first option
    if (entityCounterparty && entityCounterparty.length > 0 && treasuryEntity) {
      options = [treasuryEntity];
      // Add selected entity as second option if it's not the treasury entity
      if (selectedEntity.entity_id !== treasuryEntity.entity_id) {
        options.push(selectedEntity);
      }
    } else {
      // If no SEN1 relationship or no treasury entity, just use selected entity
      options = [selectedEntity];
    }
    
    console.log('Final hedging entity options:', options);
    return options;
  };

  // Get unique L2 categories
  const getL2Categories = () => {
    if (!exposureCategories) return [];
    const uniqueL2 = [...new Set(exposureCategories.map(cat => cat.exposure_category_l2))];
    console.log('L2 categories:', uniqueL2);
    return uniqueL2;
  };

  // Get L3 categories based on selected L2
  const getL3Categories = () => {
    if (!exposureCategories || !selectedExposureCategoryL2) return [];
    const l3Categories = exposureCategories
      .filter(cat => cat.exposure_category_l2 === selectedExposureCategoryL2)
      .map(cat => cat.exposure_category_l3);
    console.log('L3 categories for', selectedExposureCategoryL2, ':', l3Categories);
    return l3Categories;
  };

  // Handler for L2 category change
  const handleL2CategoryChange = (value: string) => {
    console.log('L2 category changed to:', value);
    setSelectedExposureCategoryL2(value);
    setSelectedExposureCategoryL3(''); // Reset L3 when L2 changes
  };

  // Update both ID and name when either changes
  const handleEntityIdChange = (newId: string) => {
    console.log('Entity ID changed to:', newId);
    setSelectedEntityId(newId);
    const entity = entities?.find(e => e.entity_id === newId);
    if (entity) {
      setSelectedEntityName(entity.entity_name);
    }
  };

  const handleEntityNameChange = (newName: string) => {
    console.log('Entity name changed to:', newName);
    setSelectedEntityName(newName);
    const entity = entities?.find(e => e.entity_name === newName);
    if (entity) {
      setSelectedEntityId(entity.entity_id);
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
        <label className="text-sm font-medium">Exposure Category</label>
        <Select value={selectedExposureCategoryL2} onValueChange={handleL2CategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select exposure category" />
          </SelectTrigger>
          <SelectContent>
            {getL2Categories().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposure Category Detail</label>
        <Select 
          value={selectedExposureCategoryL3} 
          onValueChange={setSelectedExposureCategoryL3}
          disabled={!selectedExposureCategoryL2}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category detail" />
          </SelectTrigger>
          <SelectContent>
            {getL3Categories().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
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
