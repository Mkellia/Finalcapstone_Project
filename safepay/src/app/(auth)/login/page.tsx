"use client";
import NextLink from "next/link";
import { Box, Button, Field, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      toaster.create({ title: 'Invalid credentials', type: 'error', duration: 3000 });
    } else {
      router.push('/');
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={10} borderRadius="2xl" shadow="lg" w="full" maxW="420px">
        <VStack gap={6} align="start">
          <Heading size="lg" color="blue.600">🔐 SafePay</Heading>
          <Text color="gray.500" fontSize="sm">Sign in to your account</Text>

          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" />
          </Field.Root>

          <Button w="full" colorPalette="blue" onClick={handleLogin}
            loading={loading} loadingText="Signing in...">
            Sign In
          </Button>

          <Text fontSize="sm" color="gray.500" alignSelf="center">
            No account?{' '}
            <Link as={NextLink} href="/register" color="blue.600" fontWeight="semibold">
              Register here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}