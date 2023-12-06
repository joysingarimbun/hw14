import { VStack, Box, Input, Button, Heading, FormControl, FormLabel, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <VStack spacing={8} align="center" mt={10}>
      <Box w="100%" maxW="400px" p={8} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
        <Heading mb={4} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </FormControl>

          <Button type="submit" mt={6} colorScheme="teal" size="lg" width="100%">
            Login
          </Button>

          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Text mt={4} textAlign="center">
            Don't have an account?{" "}
            <Link href="/register" passHref>
              <Text as="span" color="teal.500" cursor="pointer">
                Register here
              </Text>
            </Link>
          </Text>
        </form>
      </Box>
    </VStack>
  );
};

export default Login;
