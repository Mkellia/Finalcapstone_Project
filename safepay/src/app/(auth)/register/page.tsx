"use client";
import NextLink from "next/link";
import { Box, Button, Field, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      toaster.create({ title: 'Account created! Please sign in.', type: 'success', duration: 3000 });
      router.push('/login');
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Registration failed', type: 'error', duration: 3000 });
    }
  }

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={10} borderRadius="2xl" shadow="lg" w="full" maxW="420px">
        <VStack gap={6} align="start">
          <Heading size="lg" color="blue.600">🔐 SafePay</Heading>
          <Text color="gray.500" fontSize="sm">Create your account</Text>

          <Field.Root>
            <Field.Label>Full Name</Field.Label>
            <Input value={form.name} onChange={set('name')} placeholder="Kellia Muzira" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          </Field.Root>

          <Field.Root>
            <Field.Label>I am a</Field.Label>
            <select
              value={form.role}
              onChange={set('role')}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px',
                border: '1px solid #E2E8F0', fontSize: '14px', background: 'white',
              }}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </Field.Root>

          <Button w="full" colorPalette="blue" onClick={handleRegister}
            loading={loading} loadingText="Creating account...">
            Create Account
          </Button>

          <Text fontSize="sm" color="gray.500" alignSelf="center">
            Already have an account?{' '}
            <Link as={NextLink} href="/login" color="blue.600" fontWeight="semibold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}