"use client";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Dispute } from "@/types";

import {
  Box, Grid, GridItem, Heading, Text, VStack, Button, Stat, Textarea,
  Field, DialogRoot, DialogContent, DialogHeader, DialogTitle,
  DialogBody, DialogCloseTrigger, HStack, Input, Badge, Separator,
} from '@chakra-ui/react';

type DisputeExtended = Dispute & {
  item_name: string;
  amount: number;
  buyer_name: string;
  seller_name: string;
};

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

export default function AdminDashboard() {
  const pathname = usePathname();

  // disputes state
  const [disputes, setDisputes]   = useState<DisputeExtended[]>([]);
  const [selected, setSelected]   = useState<DisputeExtended | null>(null);
  const [resolution, setResolution] = useState('');
  const [disputeOpen, setDisputeOpen] = useState(false);

  // users state
  const [users, setUsers]         = useState<User[]>([]);
  const [userOpen, setUserOpen]   = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userForm, setUserForm]   = useState({ name: '', email: '', password: '', role: 'buyer' });

  // active tab
  const [tab, setTab] = useState<'disputes' | 'users'>('disputes');

  async function fetchDisputes() {
    const res  = await fetch('/api/disputes');
    const data = await res.json();
    setDisputes(data.disputes || []);
  }

  async function fetchUsers() {
    const res  = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    fetchDisputes();
    fetchUsers();
  }, []);

  // ── Disputes ──────────────────────────────────────────────
  function openResolution(d: DisputeExtended) {
    setSelected(d);
    setDisputeOpen(true);
  }

  async function handleRefund() {
    if (!selected) return;
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dispute_id: selected.id,
        order_id: selected.order_id,
        resolution,
      }),
    });
    if (res.ok) {
      toaster.create({ title: '✅ Refund issued and dispute resolved', type: 'success', duration: 3000 });
      setDisputeOpen(false);
      setResolution('');
      fetchDisputes();
    } else {
      toaster.create({ title: 'Failed to process refund', type: 'error', duration: 3000 });
    }
  }

  // ── Users ─────────────────────────────────────────────────
  const setU = (f: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setUserForm(prev => ({ ...prev, [f]: e.target.value }));

  async function handleCreateUser() {
    setUserLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    });
    setUserLoading(false);

    if (res.ok) {
      toaster.create({ title: 'User created successfully', type: 'success', duration: 3000 });
      setUserOpen(false);
      setUserForm({ name: '', email: '', password: '', role: 'buyer' });
      fetchUsers();
    } else {
      const data = await res.json();
      toaster.create({ title: data.error || 'Failed to create user', type: 'error', duration: 3000 });
    }
  }

  async function handleDeleteUser(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toaster.create({ title: 'User removed', type: 'info', duration: 2000 });
      fetchUsers();
    }
  }

  // ── Stats ─────────────────────────────────────────────────
  const openDisputes     = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  const disputeStats = [
    { label: 'Total Disputes', value: disputes.length,         help: 'All time' },
    { label: 'Open',           value: openDisputes.length,     help: 'Needs attention' },
    { label: 'Resolved',       value: resolvedDisputes.length, help: 'Closed' },
  ];

  const userStats = [
    { label: 'Total Users', value: users.length,                                  color: 'blue.600' },
    { label: 'Buyers',      value: users.filter(u => u.role === 'buyer').length,  color: 'blue.600' },
    { label: 'Sellers',     value: users.filter(u => u.role === 'seller').length, color: 'green.600' },
  ];

  const navLinks = [
    { label: 'Disputes', key: 'disputes' as const },
    { label: 'Users',    key: 'users' as const },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      {/* Sub-nav */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6}>
        <HStack gap={0}>
          {navLinks.map(link => (
            <Box
              key={link.key}
              px={5} py={3}
              cursor="pointer"
              borderBottom="2px solid"
              borderColor={tab === link.key ? 'blue.600' : 'transparent'}
              color={tab === link.key ? 'blue.600' : 'gray.600'}
              fontWeight={tab === link.key ? 700 : 400}
              fontSize="sm"
              onClick={() => setTab(link.key)}
              _hover={{ color: 'blue.600' }}
            >
              {link.label}
            </Box>
          ))}
        </HStack>
      </Box>

      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6}>

          {/* ── DISPUTES TAB ── */}
          {tab === 'disputes' && (
            <>
              <Box>
                <Heading size="lg">Admin Dashboard 🛡️</Heading>
                <Text color="gray.500">Review disputes and process refunds</Text>
              </Box>

              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                {disputeStats.map(s => (
                  <GridItem key={s.label}>
                    <Box bg="white" p={5} borderRadius="xl" shadow="sm"
                      border="1px solid" borderColor="gray.200">
                      <Stat.Root>
                        <Stat.Label color="gray.500">{s.label}</Stat.Label>
                        <Stat.ValueText fontSize="2xl" color="blue.600">{s.value}</Stat.ValueText>
                        <Text fontSize="xs" color="gray.400">{s.help}</Text>
                      </Stat.Root>
                    </Box>
                  </GridItem>
                ))}
              </Grid>

              <Box w="full">
                <Heading size="md" mb={4}>Open Disputes</Heading>
                <VStack gap={3} align="stretch">
                  {openDisputes.length === 0 && (
                    <Box bg="white" p={8} borderRadius="xl" textAlign="center" color="gray.400">
                      No open disputes 🎉
                    </Box>
                  )}
                  {openDisputes.map(d => (
                    <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm"
                      border="1px solid" borderColor="red.200">
                      <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                        <VStack align="start" gap={1}>
                          <Text fontWeight="bold">{d.item_name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Buyer: {d.buyer_name} · Amount: {d.amount?.toLocaleString()} RWF
                          </Text>
                          <Text fontSize="sm" color="red.500">{d.reason}</Text>
                        </VStack>
                        <Button colorPalette="red" size="sm" onClick={() => openResolution(d)}>
                          Resolve & Refund
                        </Button>
                      </Grid>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Resolved disputes */}
              {resolvedDisputes.length > 0 && (
                <Box w="full">
                  <Heading size="md" mb={4}>Resolved Disputes</Heading>
                  <VStack gap={3} align="stretch">
                    {resolvedDisputes.map(d => (
                      <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm"
                        border="1px solid" borderColor="green.200">
                        <VStack align="start" gap={1}>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="bold">{d.item_name}</Text>
                            <Badge colorPalette="green">RESOLVED</Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            Buyer: {d.buyer_name} · Amount: {d.amount?.toLocaleString()} RWF
                          </Text>
                          {d.resolution && (
                            <Text fontSize="sm" color="green.600">↳ {d.resolution}</Text>
                          )}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </>
          )}

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <>
              <HStack justify="space-between" w="full">
                <Box>
                  <Heading size="lg">User Management 👥</Heading>
                  <Text color="gray.500">Create and manage platform users</Text>
                </Box>
                <Button colorPalette="blue" onClick={() => setUserOpen(true)}>
                  + Add User
                </Button>
              </HStack>

              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                {userStats.map(s => (
                  <GridItem key={s.label}>
                    <Box bg="white" p={5} borderRadius="xl" shadow="sm"
                      border="1px solid" borderColor="gray.200">
                      <Text color="gray.500" fontSize="sm">{s.label}</Text>
                      <Text fontSize="2xl" fontWeight="bold" color={s.color}>{s.value}</Text>
                    </Box>
                  </GridItem>
                ))}
              </Grid>

              <Box w="full" bg="white" borderRadius="xl" shadow="sm"
                border="1px solid" borderColor="gray.200" overflow="hidden">
                <Box p={4} borderBottom="1px solid" borderColor="gray.100">
                  <Text fontWeight="semibold">All Users ({users.length})</Text>
                </Box>
                <VStack gap={0} align="stretch">
                  {users.length === 0 && (
                    <Box p={8} textAlign="center" color="gray.400">No users found</Box>
                  )}
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
                            onClick={() => handleDeleteUser(u.id)}>
                            Remove
                          </Button>
                        </HStack>
                      </HStack>
                      {i < users.length - 1 && <Separator />}
                    </Box>
                  ))}
                </VStack>
              </Box>
            </>
          )}

        </VStack>
      </Box>

      {/* Resolve Dispute Dialog */}
      <DialogRoot open={disputeOpen} onOpenChange={e => setDisputeOpen(e.open)}>
        <DialogContent borderRadius="xl">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack gap={4}>
              <Text fontSize="sm" color="gray.500">
                This will refund the buyer and close the dispute.
              </Text>
              <Field.Root>
                <Field.Label>Resolution Notes</Field.Label>
                <Textarea value={resolution} onChange={e => setResolution(e.target.value)}
                  placeholder="Explain the resolution..." />
              </Field.Root>
              <Button w="full" colorPalette="red" onClick={handleRefund}>
                Issue Refund & Close Dispute
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Create User Dialog */}
      <DialogRoot open={userOpen} onOpenChange={e => setUserOpen(e.open)}>
        <DialogContent borderRadius="xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack gap={4}>
              <Field.Root>
                <Field.Label>Full Name</Field.Label>
                <Input value={userForm.name} onChange={setU('name')} placeholder="John Doe" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input type="email" value={userForm.email} onChange={setU('email')}
                  placeholder="john@example.com" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input type="password" value={userForm.password} onChange={setU('password')}
                  placeholder="••••••••" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Role</Field.Label>
                <select value={userForm.role} onChange={setU('role')}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid #E2E8F0', fontSize: '14px', background: 'white' }}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </Field.Root>
              <Button w="full" colorPalette="blue" onClick={handleCreateUser} loading={userLoading}>
                Create User
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}