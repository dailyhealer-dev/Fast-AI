import React from "react";
import { Box, Text, Avatar, Flex } from "@chakra-ui/react";

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <Flex justify="flex-end" mb={3}>
      <Box
        bg="blue.500"
        color="white"
        px={4}
        py={2}
        borderRadius="20px"
        maxW="70%"
      >
        <Text>{message}</Text>
      </Box>
      <Text ml={2} />
    </Flex>
  );
};

export default UserMessage;
