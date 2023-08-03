"use client";

import { ChatCompletionRequestMessage } from "openai-edge";
import { FormEvent, useCallback, useState } from "react";

function useMessages() {
  // Will contain all messages (from user and assistant.)
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const addMessage = useCallback(
    async (msg: ChatCompletionRequestMessage) => {
      const allNewMessages = messages.concat(msg);
      // Adds input from GPT as a message.
      setMessages(allNewMessages);

      const result = await fetch("/api/no-stream", {
        method: "POST",
        // Send in all messages all the time. This will grow over time.
        body: JSON.stringify({ messages: allNewMessages }),
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
        },
      });
      if (!result.ok) return;
      const res = await result.json();
      const newResponse = res.choices[0].message;

      // Adds response from GPT as a message.
      setMessages(allNewMessages.concat(newResponse));
    },
    [messages, setMessages]
  );
  const clear = useCallback(() => setMessages([]), [setMessages]);

  return {
    messages,
    addMessage,
    clear,
  };
}

export default function ManualChat() {
  const { messages, addMessage } = useMessages();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = new FormData(e.currentTarget).get("message");

    e.currentTarget.reset();
    await addMessage({
      role: "user",
      content: input?.toString(),
    });
  }
  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} method="post">
        <input
          name="message"
          placeholder="Say something..."
          className="text-black"
        />
      </form>
    </div>
  );
}
