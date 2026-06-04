import ChatMessage from "./ChatMessage";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const ChatMessages = ({
  messages,
  isLoading,
}: Props) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}

      {isLoading && (
        <ChatMessage
          role="assistant"
          content="Thinking..."
        />
      )}
    </div>
  );
};

export default ChatMessages;