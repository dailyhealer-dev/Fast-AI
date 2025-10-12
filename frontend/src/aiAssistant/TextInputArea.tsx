import { Button, Flex, Input } from "@chakra-ui/react";
import { faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../redux/app/hooks";
import { sendMessage } from "../redux/features/aichat/aichatSlice";

interface TextInputAreaProps {
  conversationId?: number | null;
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
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning("Please type a message before sending.");
      return;
    }

    setLoading(true);

    try {
      // Dispatch sendMessage; if conversationId is undefined, slice will create one
      const resultAction = await dispatch(
        sendMessage({
          content: message,
          conversationId: conversationId ?? undefined,
        })
      );

      if (sendMessage.fulfilled.match(resultAction)) {
        setMessage(""); // clear input
        toast.success("Message sent successfully!");

        // If conversation was created in the slice
        if (
          !conversationId &&
          resultAction.meta.arg.conversationId === undefined
        ) {
          onConversationCreated?.({
            id: resultAction.payload.conversation,
            title: "New Chat",
          });
        }

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