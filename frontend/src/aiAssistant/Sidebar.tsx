import React, { useEffect, useState, useMemo } from "react";
import { Box, Flex, List, Spinner, Text, Button } from "@chakra-ui/react";
import { faCaretRight, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { loadConversations } from "../redux/features/aichat/aichatSlice";

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, loading, error } = useAppSelector(
    (state) => state.aichat
  );

  // Number of conversations to show initially
  const INITIAL_VISIBLE = 20;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    dispatch(loadConversations());
  }, [dispatch]);

  // Sort conversations by date (most recent first)
  const sortedConversations = useMemo(() => {
    return [...conversations].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [conversations]);

  // Slice only the visible conversations
  const visibleConversations = sortedConversations.slice(0, visibleCount);

  return (
    <Box
      h="100vh"
      bgColor="#f6f3f1"
      px={4}
      py={6}
      overflowY="auto"
      boxShadow="md"
    >
      <List.Root style={{ listStyle: "none" }} gap={4}>
        <List.Item pb={4}>
          <NavLink to="/dashboard" className="navlink">
            <FontAwesomeIcon icon={faCaretRight} /> Your Chat
          </NavLink>
        </List.Item>

        {loading && (
          <Flex align="center" justify="center" py={4}>
            <Spinner size="sm" color="blue.500" />
            <Text ml={2} fontSize="sm" color="gray.600">
              Loading conversations...
            </Text>
          </Flex>
        )}

        {!loading && error && (
          <Text fontSize="sm" color="red.500" mt={2}>
            Failed to load conversations.
          </Text>
        )}

        {!loading && !error && visibleConversations.length > 0 ? (
          visibleConversations.map((conv) => (
            <List.Item key={conv.id}>
              <NavLink
                to={`/conversation/${conv.id}`}
                className="navlink"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                  padding: "6px 0",
                  textDecoration: "none",
                }}
              >
                <FontAwesomeIcon icon={faMinus} style={{ marginRight: "8px" }} />
                <Text
                  as="span"
                  fontSize="sm"
                  maxW="100%"
                  lineClamp="1"
                >
                  {conv.title || "Untitled Chat"}
                </Text>
              </NavLink>
            </List.Item>
          ))
        ) : (
          !loading &&
          !error && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              No conversations yet.
            </Text>
          )
        )}

        {/* Load More button */}
        {visibleCount < sortedConversations.length && !loading && !error && (
          <Flex justify="center" mt={2}>
            <Button
              size="sm"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE)}
            >
              Load More
            </Button>
          </Flex>
        )}
      </List.Root>
    </Box>
  );
};
