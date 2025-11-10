import { Button, Flex, Input } from "@chakra-ui/react";
import { faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../redux/app/hooks";
import { sendMessage, createConversation } from "../redux/features/aichat/aichatSlice";

interface TextInputAreaProps {
  conversationId?: number; // number or undefined
  onConversationCreated?: (conversation: any) => void;
  onMessageSent?: (message: any) => void;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  conversationId,
  onConversationCreated,
  onMessageSent,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(conversationId);
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning("Please type a message before sending.");
      return;
    }

    setLoading(true);

    try {
      let convId = currentConversationId;

      // Create a new conversation if no conversation exists
      if (!convId) {
        const newConvAction = await dispatch(createConversation());
        if (createConversation.fulfilled.match(newConvAction)) {
          convId = newConvAction.payload.id;
          setCurrentConversationId(convId);
          onConversationCreated?.(newConvAction.payload);
        } else {
          throw new Error("Failed to create conversation");
        }
      }

      // Send message
      const resultAction = await dispatch(
        sendMessage({ content: message, conversationId: convId ?? undefined })
      );

      if (sendMessage.fulfilled.match(resultAction)) {
        setMessage(""); // clear input
        toast.success("Message sent successfully!");
        onMessageSent?.(resultAction.payload);
      } else {
        throw new Error(resultAction.error?.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Send Error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      bg="white"
      borderRadius="full"
      align="center"
      px={3}
      py={2}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      mt={2}
    >
      {/* File/Attachment button */}
      <Button
        variant="ghost"
        fontSize="20px"
        colorScheme="blue"
        p={2}
        borderRadius="full"
        onClick={() => toast.info("You can attach files soon!")}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>

      {/* Text input */}
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        border="none"
        bg="transparent"
        mx={2}
        _focus={{ boxShadow: "none" }}
      />

      {/* Send button */}
      <Button
        disabled={loading}
        onClick={handleSend}
        variant="ghost"
        fontSize="20px"
        colorScheme="blue"
        p={2}
        borderRadius="full"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </Flex>
  );
};
