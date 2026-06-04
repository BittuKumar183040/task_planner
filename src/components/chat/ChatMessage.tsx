import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  role: "user" | "assistant";
  content: string;
};

const ChatMessage = ({
  role,
  content,
}: Props) => {
  return (
    <div className={`flex ${ role === "user" ? "justify-end" : "justify-start" }`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-3 ${role === "user" ? "bg-blue-600 text-white" : "border bg-gray-50 text-gray-900" }`}>
        <div className="mb-1 text-xs font-semibold opacity-70">
          {role === "user" ? "You" : "Tasky AI"}
        </div>

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;