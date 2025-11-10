import React from "react";
import { Box, VStack, Text, Table } from "@chakra-ui/react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";


// --- Utility: clean redundant newlines globally ---
const cleanMarkdownText = (text: string) => {
  return text.replace(/\n\s*\n/g, "\n\n").trim();
};

interface ChatroomProps {
  messages: { sender: "user" | "assistant"; content: string }[];
  height?: number;
}

export const Chatroom: React.FC<ChatroomProps> = ({ messages, height }) => {
  return (
    <Box
      w="100%"
      h={height || "90vh"}
      p={4}
      bg="gray.50"
      display="flex"
      flexDirection="column"
      overflowY="auto"
      className="chat-scroll"
    >
      <VStack align="stretch" gap={3}>
        {messages.map((msg, idx) => {
          const cleanedContent = cleanMarkdownText(msg.content);

          return msg.sender === "user" ? (
            <UserMessage key={idx} message={cleanedContent} />
          ) : (
            <AssistantMessage key={idx} message={cleanedContent} />
          );
        })}
      </VStack>
    </Box>
  );
};
