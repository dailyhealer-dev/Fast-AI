import React from "react";
import { Box, Button, Flex, Heading, HStack, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlorinSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login"); // redirect after logout
  };

  // Guest links (Login / Sign Up)
  const guestLinks = () => (
    <HStack gap="20px">
      <Button bg="#f6f3f1" style={{ border: "none", outline: "none" }}>
        <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
          Login
        </Link>
      </Button>

      <Button color="black" bg="#f6f3f1" style={{ border: "none", outline: "none" }}>
        <Link to="/signup" style={{ textDecoration: "none", color: "black" }}>
          Sign Up
        </Link>
      </Button>
    </HStack>
  );

  // Authenticated user links (Avatar + Logout)
  const authLinks = () => {
    // Get first letter of user's first_name
    const userLetter = user?.first_name
      ? user.first_name.charAt(0).toUpperCase()
      : "U"; // default if user is null

    return (
      <HStack gap="20px">
        <Box
          borderRadius="50%"
          bg="gray.300"
          w="35px"
          h="35px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          color="black"
        >
          {userLetter}
        </Box>
        <Button
          bg="#f6f3f1"
          onClick={handleLogout}
          style={{ border: "none", outline: "none" }}
        >
          Logout
        </Button>
      </HStack>
    );
  };

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
        <Heading>
          <FontAwesomeIcon icon={faFlorinSign} /> astAI
        </Heading>
      </Link>

      <Spacer />

      {isAuthenticated ? authLinks() : guestLinks()}
    </Flex>
  );
};

export default Navbar;
