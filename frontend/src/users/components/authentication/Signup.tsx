import { Box, Button, Field, Heading, Input, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <Box
            minH="100vh" // full viewport height
            display="flex"
            justifyContent="center"
            bg="white"
            marginTop="10px"
        >  
                <Box
                    maxW={700}
                    border="1px solid grey"
                    borderRadius="md"
                    boxShadow="0 0 0 1px #ccc" // outline-like effect
                    bg="white"
                    paddingLeft={20}
                    paddingRight={20}
                    paddingTop={5}
                    paddingBottom={5}
                >
                    <Heading>Sign Up</Heading>
                    <Text>Register an account</Text>
                    <form style={{width: '500px'}}>
                        <Field.Root marginBottom={5}>
                            <Field.Label>First Name</Field.Label>
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    name="first_name"
                                    required
                                />
                        </Field.Root>

                        <Field.Root marginBottom={5}>
                            <Field.Label>Last Name</Field.Label>
                                <Input
                                    type="text"
                                    placeholder="Last Name"
                                    name="last_name"
                                    required
                                />
                        </Field.Root>

                        <Field.Root marginBottom={5}>
                            <Field.Label>Email</Field.Label>
                                <Input 
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    required
                                />
                        </Field.Root>
    
                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    required
                                />
                        </Field.Root>
    
                        <Button type="submit" marginTop={5}>Login</Button>
                        <Text marginTop={5}>
                            Have an account? <Link to='/Login' style={{textDecoration: 'None', color: 'black'}}>Login</Link> 
                        </Text>
                    </form>
                </Box>
            </Box>
        )
}

export default Signup;