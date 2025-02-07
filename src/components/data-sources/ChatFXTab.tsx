import ChatBot from "@/components/ChatBot";

const ChatFXTab = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">ChatFX Assistant</h2>
      <p className="text-muted-foreground mb-6">
        Ask questions about your documents and get AI-powered responses.
      </p>
      <ChatBot />
    </div>
  );
};

export default ChatFXTab;