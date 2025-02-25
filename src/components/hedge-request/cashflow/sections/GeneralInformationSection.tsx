
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
  entity_id: string;
  exposure_type_id: number;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  subsystem: string;
  is_active: boolean;
}

interface Strategy {
  strategy_id: string;
  strategy_name: string;
  exposure_category_l2: string;
  instrument: string;
}

const GeneralInformationSection = () => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [exposedCurrency, setExposedCurrency] = useState("");
  const [selectedHedgingEntity, setSelectedHedgingEntity] = useState("");
  const [hedgingEntityFunctionalCurrency, setHedgingEntityFunctionalCurrency] = useState("");
  const [selectedExposureCategoryL1, setSelectedExposureCategoryL1] = useState("");
  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState("");
  const [selectedExposureCategoryL3, setSelectedExposureCategoryL3] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");

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

  // Fetch entity exposure configurations
  const { data: exposureConfigs } = useQuery({
    queryKey: ['entity-exposure-config', selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return null;
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          entity_id,
          exposure_type_id,
          exposure_types (
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3,
            subsystem
          )
        `)
        .eq('entity_id', selectedEntityId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEntityId
  });

  // Fetch available strategies
  const { data: strategies } = useQuery({
    queryKey: ['hedge-strategies', selectedExposureCategoryL2],
    queryFn: async () => {
      if (!selectedExposureCategoryL2) return null;
      const { data, error } = await supabase
        .from('hedge_strategy')
        .select('*')
        .eq('exposure_category_l2', selectedExposureCategoryL2);
      
      if (error) throw error;
      return data as Strategy[];
    },
    enabled: !!selectedExposureCategoryL2
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

  // Helper functions for getting unique categories
  const getL1Categories = () => {
    if (!exposureConfigs) return [];
    return [...new Set(exposureConfigs.map(config => 
      config.exposure_types.exposure_category_l1
    ))];
  };

  const getL2Categories = () => {
    if (!exposureConfigs || !selectedExposureCategoryL1) return [];
    return [...new Set(exposureConfigs
      .filter(config => config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1)
      .map(config => config.exposure_types.exposure_category_l2)
    )];
  };

  const getL3Categories = () => {
    if (!exposureConfigs || !selectedExposureCategoryL2) return [];
    return [...new Set(exposureConfigs
      .filter(config => 
        config.exposure_types.exposure_category_l2 === selectedExposureCategoryL2
      )
      .map(config => config.exposure_types.exposure_category_l3)
    )];
  };

  // Handlers for category changes
  const handleCategoryChange = (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => {
    switch (level) {
      case 'L1':
        setSelectedExposureCategoryL1(value);
        setSelectedExposureCategoryL2('');
        setSelectedExposureCategoryL3('');
        setSelectedStrategy('');
        break;
      case 'L2':
        setSelectedExposureCategoryL2(value);
        setSelectedExposureCategoryL3('');
        setSelectedStrategy('');
        break;
      case 'L3':
        setSelectedExposureCategoryL3(value);
        break;
      case 'strategy':
        setSelectedStrategy(value);
        // Find and set matching exposure categories if not already set
        if (strategies) {
          const strategy = strategies.find(s => s.strategy_name === value);
          if (strategy) {
            const matchingConfig = exposureConfigs?.find(config => 
              config.exposure_types.exposure_category_l2 === strategy.exposure_category_l2
            );
            if (matchingConfig) {
              setSelectedExposureCategoryL1(matchingConfig.exposure_types.exposure_category_l1);
              setSelectedExposureCategoryL2(strategy.exposure_category_l2);
            }
          }
        }
        break;
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      {/* Row 1 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge ID</label>
        <Input type="text" placeholder="Enter hedge ID" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Entity Name</label>
        <Select value={selectedEntityName} onValueChange={(value) => {
          setSelectedEntityName(value);
          const entity = entities?.find(e => e.entity_name === value);
          if (entity) setSelectedEntityId(entity.entity_id);
        }}>
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
        <Input 
          type="text" 
          value={selectedEntityId} 
          disabled
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Functional Currency</label>
        <Input 
          type="text" 
          value={entities?.find(e => e.entity_id === selectedEntityId)?.functional_currency || ''} 
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
        <label className="text-sm font-medium">Exposure Category L1</label>
        <Select 
          value={selectedExposureCategoryL1} 
          onValueChange={(value) => handleCategoryChange('L1', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {getL1Categories().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposure Category L2</label>
        <Select 
          value={selectedExposureCategoryL2} 
          onValueChange={(value) => handleCategoryChange('L2', value)}
          disabled={!selectedExposureCategoryL1}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subcategory" />
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
        <label className="text-sm font-medium">Exposure Category L3</label>
        <Select 
          value={selectedExposureCategoryL3} 
          onValueChange={(value) => handleCategoryChange('L3', value)}
          disabled={!selectedExposureCategoryL2}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select detail" />
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
        <label className="text-sm font-medium">Strategy</label>
        <Select 
          value={selectedStrategy} 
          onValueChange={(value) => handleCategoryChange('strategy', value)}
          disabled={!selectedExposureCategoryL2}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            {strategies?.map(strategy => (
              <SelectItem key={strategy.strategy_id} value={strategy.strategy_name}>
                {strategy.strategy_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity</label>
        <Input 
          type="text" 
          value={selectedHedgingEntity} 
          disabled
          className="bg-gray-100"
        />
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
