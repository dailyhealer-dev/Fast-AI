import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";

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
      justifyContent="space-between"
      className="chat-scroll" flex="1" overflowY="auto" pb={3}
    >
      <VStack align="stretch" gap={3}>
          {messages.map((msg, idx) =>
            msg.sender === "user" ? (
              <UserMessage key={idx} message={msg.content} />
            ) : (
              <AssistantMessage key={idx} message={msg.content} />
            )
          )}
        </VStack>
    </Box>
  );
};
