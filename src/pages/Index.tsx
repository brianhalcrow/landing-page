
import Dashboard from "@/components/Dashboard";
import { useCube } from "@/integrations/cube/context/CubeContext";

const Index = () => {
  const cubeApi = useCube();

  // Test the connection
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await cubeApi.load({
          measures: ["Orders.count"],
          dimensions: ["Orders.status"],
        });
        console.log('Cube.js connection successful:', response);
      } catch (error) {
        console.error('Cube.js connection error:', error);
      }
    };

    testConnection();
  }, [cubeApi]);

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Index;
