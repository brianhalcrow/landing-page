
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModuleRegistry, LicenseManager as GridLicenseManager } from 'ag-grid-enterprise';
import { AllEnterpriseModule, RowGroupingModule } from 'ag-grid-enterprise';
import { AgCharts } from "ag-charts-react";
import { LicenseManager as ChartsLicenseManager } from "ag-charts-enterprise";
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'

// Set AG Grid Enterprise License
const LICENSE_KEY = '[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-074442}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{28 February 2025}____[v3]_[0102]_MTc0MDcwMDgwMDAwMA==bb2688d270ed69f72a8ba59760c71424';
GridLicenseManager.setLicenseKey(LICENSE_KEY);
ChartsLicenseManager.setLicenseKey(LICENSE_KEY);

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([
  AllEnterpriseModule,
  RowGroupingModule
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
