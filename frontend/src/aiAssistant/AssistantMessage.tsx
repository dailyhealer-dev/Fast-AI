import React from "react";
import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlorinSign } from "@fortawesome/free-solid-svg-icons";

interface AssistantMessageProps {
  message: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  return (
    <Flex justify="flex-start" mb={3}>
      <FontAwesomeIcon size="sm" name="AI" icon={faFlorinSign} />
      <Box
        bg="gray.100"
        color="black"
        px={4}
        py={2}
        borderRadius="20px"
        maxW="70%"
      >
        <Text>{message}</Text>
      </Box>
    </Flex>
  );
};

export default AssistantMessage;
