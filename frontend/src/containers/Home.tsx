import React, { useRef, useState, useEffect } from "react";
import { Grid, GridItem, Box, Flex } from "@chakra-ui/react";
import { Chatroom } from "../aiAssistant/Chatroom";
import { TextInputArea } from "../aiAssistant/TextInputArea";
import { Sidebar } from "../aiAssistant/Sidebar";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import {
  loadMessages,
} from "../redux/features/aichat/aichatSlice";

const Home = () => {
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [mainContentHeight, setMainContentHeight] = useState(0);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<
    { sender: "user" | "assistant"; content: string }[]
  >([]);

  const dispatch = useAppDispatch();
  const latestMessage = useAppSelector((state) => state.aichat.latestMessage);
  const conversationMessages = useAppSelector(
    (state) => state.aichat.messages
  );

  const NAVBAR_HEIGHT = 61;
  const MAIN_CONTENT_WIDTH = 900;

  // Set chat container height dynamically
  useEffect(() => {
    const updateHeight = () =>
      setMainContentHeight(window.innerHeight - NAVBAR_HEIGHT);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  /** Handles when backend creates a new conversation */
  const handleConversationCreated = (conversation: any) => {
    setConversationId(conversation.id);
  };

  /** Handles when user sends a message */
  const handleMessageSent = (messageList: any) => {
  if (!Array.isArray(messageList)) return;
  setMessages(
    messageList.map((msg) => ({
      sender: msg.sender === "assistant" ? "assistant" : "user",
      content: msg.content,
    }))
  );
};

  /** Load all messages when conversation changes */
  useEffect(() => {
    if (conversationId) {
      dispatch(loadMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  /** Update chat whenever messages from Redux change */
  useEffect(() => {
    if (conversationMessages?.length) {
      setMessages(
        conversationMessages.map((msg: any) => ({
          sender: msg.sender_type === "assistant" ? "assistant" : "user",
          content: msg.content,
        }))
      );
    }
  }, [conversationMessages]);

  /** Add latest AI reply to chat */
  useEffect(() => {
    if (latestMessage?.sender === "assistant") {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", content: latestMessage.content },
      ]);
    }
  }, [latestMessage]);

  /** Auto-scroll chat to bottom */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Grid templateColumns="200px 1fr" 
        // gap={4} px={4} 
        overflowY='scroll'
        h={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
    >
      {/* Sidebar */}
      <GridItem>
        <Sidebar />
      </GridItem>

      {/* Main Chat Area */}
      <GridItem justifyContent="center" display="flex">
        <Flex direction="column" h={mainContentHeight} w={MAIN_CONTENT_WIDTH}>
          {/* Chat messages area */}
          <Box ref={chatContainerRef} flex="1">
            <Chatroom messages={messages} height={mainContentHeight - 70} />
          </Box>

          {/* Text input area */}
          <Box mt={2}>
            <TextInputArea
              conversationId={conversationId}
              onConversationCreated={handleConversationCreated}
              onMessageSent={handleMessageSent}
            />
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Home;