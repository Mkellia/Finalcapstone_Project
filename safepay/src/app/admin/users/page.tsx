"use client";
import Navbar from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";

import {
  Box, Button, Field, Grid, GridItem, Heading,
  HStack, Input, Text, VStack,
  DialogRoot, DialogContent, DialogHeader,
  DialogTitle, DialogBody, DialogCloseTrigger,
  Badge, Separator,
} from '@chakra-ui/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const roleColor: Record<string, string> = {
  buyer: 'blue', seller: 'green', admin: 'red',
};

export default function AdminUsersPage() {
  const [users, setUsers]   = useState<User[]>([]);
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'buyer' });

  async function fetchUsers() {
    const res  = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => { fetchUsers(); }, []);

  const set = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [f]: e.target.value }));

  async function handleCreate() {
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      toaster.create({ title: 'User created successfully', type: 'success', duration: 3000 });
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'buyer' });
      fetchUsers();
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Failed to create user', type: 'error', duration: 3000 });
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toaster.create({ title: 'User deleted', type: 'info', duration: 2000 });
      fetchUsers();
    } else {
      const data = await res.json().catch(() => ({}));
      toaster.create({ title: data.error || 'Failed to delete user', type: 'error', duration: 3000 });
    }
  }

  const buyers  = users.filter(u => u.role === 'buyer').length;
  const sellers = users.filter(u => u.role === 'seller').length;
  const admins  = users.filter(u => u.role === 'admin').length;

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6}>
          <HStack justify="space-between" w="full">
            <Box>
              <Heading size="lg">User Management 👥</Heading>
              <Text color="gray.500">Create and manage platform users</Text>
            </Box>
            <HStack>
              <Button variant="outline" onClick={fetchUsers}>Refresh</Button>
              <DialogRoot open={open} onOpenChange={e => setOpen(e.open)}>
                <Button colorPalette="blue" onClick={() => setOpen(true)}>+ Add User</Button>
                <DialogContent borderRadius="xl">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <DialogCloseTrigger />
                  <DialogBody pb={6}>
                    <VStack gap={4}>
                      <Field.Root>
                        <Field.Label>Full Name</Field.Label>
                        <Input value={form.name} onChange={set('name')} placeholder="John Doe" />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Role</Field.Label>
                        <select value={form.role} onChange={set('role')}
                          style={{ width:'100%', padding:'8px 12px', borderRadius:'6px',
                            border:'1px solid #E2E8F0', fontSize:'14px', background:'white' }}>
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </Field.Root>
                      <Button w="full" colorPalette="blue" onClick={handleCreate} loading={loading}>
                        Create User
                      </Button>
                    </VStack>
                  </DialogBody>
                </DialogContent>
              </DialogRoot>
            </HStack>
          </HStack>

          <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
            {[
              { label: 'Buyers',  value: buyers,  color: 'blue.600' },
              { label: 'Sellers', value: sellers, color: 'green.600' },
              { label: 'Admins',  value: admins,  color: 'red.600' },
            ].map(s => (
              <GridItem key={s.label}>
                <Box bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Text color="gray.500" fontSize="sm">{s.label}</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={s.color}>{s.value}</Text>
                </Box>
              </GridItem>
            ))}
          </Grid>

          <Box w="full" bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
            <Box p={4} borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight="semibold">All Users ({users.length})</Text>
            </Box>
            <VStack gap={0} align="stretch">
              {users.map((u, i) => (
                <Box key={u.id}>
                  <HStack p={4} justify="space-between">
                    <HStack gap={4}>
                      <Box w="36px" h="36px" borderRadius="full" bg="blue.100"
                        display="flex" alignItems="center" justifyContent="center">
                        <Text fontWeight="bold" color="blue.600" fontSize="sm">
                          {u.name[0].toUpperCase()}
                        </Text>
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="semibold" fontSize="sm">{u.name}</Text>
                        <Text fontSize="xs" color="gray.500">{u.email}</Text>
                      </VStack>
                    </HStack>
                    <HStack gap={3}>
                      <Badge colorPalette={roleColor[u.role]}>{u.role.toUpperCase()}</Badge>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </Text>
                      <Button size="xs" colorPalette="red" variant="ghost"
                        onClick={() => handleDelete(u.id)}>
                        Remove
                      </Button>
                    </HStack>
                  </HStack>
                  {i < users.length - 1 && <Separator />}
                </Box>
              ))}
              {users.length === 0 && (
                <Box p={8} textAlign="center" color="gray.400">No users found</Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
