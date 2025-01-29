import ConfigurationForm from "./form/ConfigurationForm";

const GeneralTab = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Hedge Configuration</h2>
      <ConfigurationForm />
    </div>
  );
};

export default GeneralTab;