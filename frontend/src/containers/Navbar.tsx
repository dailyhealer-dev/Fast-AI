import React from "react";
import { Box, Button, Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlorinSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login"); // redirect after logout
  };

  const guestLinks = () => (
    <HStack gap="20px">
      <Button bg="#f6f3f1">
        <Link to="/login" style={{ textDecoration: "none", color: "green" }}>
          Login
        </Link>
      </Button>

      <Button color="black" bg="#f6f3f1">
        <Link to="/signup" style={{ textDecoration: "none", color: "green" }}>
          Sign Up
        </Link>
      </Button>
    </HStack>
  );

  const authLinks = () => (
    <HStack gap="20px">
      <Box bg="gray.200" p="10px" borderRadius="50%">
        M
      </Box>
      <Button bg="#f6f3f1" onClick={handleLogout}>
        Logout
      </Button>
    </HStack>
  );

  return (
    <Flex
      as="nav"
      p="10px"
      alignItems="center"
      bg="#f6f3f1"
      marginBottom="5px"
      justifyContent="center"
    >
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <Heading style={{ color: "green" }}>
          <FontAwesomeIcon icon={faFlorinSign} color="green" />
          astAI
        </Heading>
      </Link>
      <Spacer />

      <HStack gap="20px">
        <Text color="green">Health Check</Text>
        <Text color="green">Exercise</Text>
        <Text color="green">Nutrition</Text>
      </HStack>

      <Spacer />

      {isAuthenticated ? authLinks() : guestLinks()}
    </Flex>
  );
};

export default Navbar;
