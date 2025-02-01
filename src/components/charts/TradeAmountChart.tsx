import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TradeData {
  entity_name: string;
  total_amount: number;
}

const TradeAmountChart = () => {
  const [chartData, setChartData] = useState<TradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: trades, error } = await supabase
          .from("hedge_request_draft_trades")
          .select(`
            draft_id,
            buy_sell_amount,
            hedge_request_draft!inner (
              entity_name
            )
          `)
          .not("buy_sell_amount", "is", null);

        if (error) throw error;

        // Aggregate data by entity_name
        const aggregatedData = (trades || []).reduce((acc: { [key: string]: number }, curr) => {
          const entityName = curr.hedge_request_draft?.entity_name || "Unknown";
          acc[entityName] = (acc[entityName] || 0) + (curr.buy_sell_amount || 0);
          return acc;
        }, {});

        // Transform to array format
        const formattedData = Object.entries(aggregatedData).map(([entity_name, total_amount]) => ({
          entity_name,
          total_amount,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching trade data:", error);
        toast.error("Failed to load trade data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "Trade Amounts by Entity",
      style: {
        color: "#333",
      },
    },
    xAxis: {
      categories: chartData.map((item) => item.entity_name),
      title: {
        text: "Entity Name",
      },
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        type: "column",
        name: "Trade Amount",
        data: chartData.map((item) => item.total_amount),
        color: "#4F46E5",
      },
    ],
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderRadius: 5,
      },
    },
  };

  if (isLoading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="w-full h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TradeAmountChart;