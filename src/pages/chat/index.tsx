import React, { useEffect, useRef, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { ChatInput } from "~/components/ui/Input";
import { getCurrentTeamId } from "~/helper/localstorageHelper";
import { api } from "~/utils/api";
import ChatHeader from "~/components/chat/ChatHeader";
import ChatMessages from "~/components/chat/ChatMessages";

type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "tasky-ai-chat-history";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    setTeamId(getCurrentTeamId());
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages) as ChatMessageType[]);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const askMutation = api.ask.ask.useMutation({
    onSuccess: (data) => {
      let content = "";

      if (data.type === "message") {
        content = String(data.data);
      } else {
        content = JSON.stringify(data.data, null, 2);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
        },
      ]);
    },

    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: error.message,
        },
      ]);
    },
  });

  const handleSubmit = async () => {
    const question = input.trim();

    if (!question || askMutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      },
    ]);

    setInput("");

    try {
      await askMutation.mutateAsync({
        teamId: teamId,
        question,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <ChatHeader
          hasMessages={messages.length > 0}
          onClear={clearChat}
        />
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ChatMessages
            messages={messages}
            isLoading={askMutation.isPending}
          />
        </div>

        <ChatInput
          value={input}
          loading={askMutation.isPending}
          onChange={setInput}
          onSubmit={() => void handleSubmit()}
        />
      </div>
    </AppLayout>
  );
};

export default Chat;