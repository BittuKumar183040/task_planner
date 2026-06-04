type Props = {
  hasMessages: boolean;
  onClear: () => void;
};

const ChatHeader = ({
  hasMessages,
  onClear,
}: Props) => {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h1 className="text-lg font-semibold">
          Chat with AI
        </h1>

        <p className="text-gray-600">
          Ask questions related to your tasks,
          teams and projects.
        </p>
      </div>

      {hasMessages && (
        <button
          onClick={onClear}
          className="rounded border px-3 py-2 text-sm hover:bg-gray-100"
        >
          Clear Chat
        </button>
      )}
    </div>
  );
};

export default ChatHeader;