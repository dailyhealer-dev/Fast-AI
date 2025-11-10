import React from "react";
import { Box, Flex, Text, Table, List } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlorinSign } from "@fortawesome/free-solid-svg-icons";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

// --- Chakra wrappers ---
const ChakraWrapper = (as: "b" | "i" | "p" | "a" | "h1" | "h2" | "h3") => (props: any) => (
  <Text as={as} {...props} ref={undefined} />
);
const ChakraBlockquote = (props: any) => <Box as="blockquote" {...props} ref={undefined} />;

// --- Detect tables ---
const containsTable = (message: string) => {
  return /\|.*\|/.test(message) && /\|[-\s|]+\|/.test(message);
};

// --- Detect lists ---
const containsList = (message: string) => /^(\s*([-*]|\d+\.)\s)/m.test(message);

// --- Clean Markdown ---
const cleanMarkdownText = (text?: string) => (text || "").replace(/\n\s*\n/g, "\n\n").trim();


// --- Props ---
interface AssistantMessageProps {
  message: string;
}

// --- Component ---
const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  const useTableComponents = containsTable(message);
  const useListComponents = containsList(message);
  const cleanedMessage = cleanMarkdownText(message);

  return (
    <Flex justify="flex-start" mb={3}>
      <FontAwesomeIcon
        size="sm"
        icon={faFlorinSign}
        style={{ marginRight: "8px", marginTop: "8px" }}
      />

      <Box
        bg="gray.100"
        color="black"
        px={4}
        py={2}
        borderRadius="20px"
        maxW="100%"
        fontSize="sm"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ChakraWrapper("p"),
            strong: ChakraWrapper("b"),
            em: ChakraWrapper("i"),
            a: ChakraWrapper("a"),
            blockquote: ChakraBlockquote,
            h1: ChakraWrapper("h1"),
            h2: ChakraWrapper("h2"),
            h3: ChakraWrapper("h3"),

            ...(useTableComponents
              ? {
                  table: ({ node, ...props }) => <Table.Root size="sm" {...props} />,
                  thead: ({ node, ...props }) => <Table.Header {...props} />,
                  tbody: ({ node, ...props }) => <Table.Body {...props} />,
                  tr: ({ node, ...props }) => <Table.Row {...props} />,
                  th: ({ node, ...props }) => <Table.ColumnHeader {...props} />,
                  td: ({ node, ...props }) => <Table.Cell {...props} />,
                }
              : {}),

            ...(useListComponents
              ? {
                  ul: ({ node, children, ...props }) => (
                    <List.Root as="ul" gap={1} {...props}>
                      {children}
                    </List.Root>
                  ),
                  ol: ({ node, children, ...props }) => (
                    <List.Root as="ol" gap={1} {...props}>
                      {children}
                    </List.Root>
                  ),
                  li: ({ node, children, ...props }) => <List.Item {...props}>{children}</List.Item>,
                }
              : {}),
          }}
        >
          {cleanedMessage}
        </Markdown>
      </Box>
    </Flex>
  );
};

export default AssistantMessage;
