"use client";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import TransactionCard from "@/components/ui/TransactionCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Order, Product } from "@/types";

import {
  Box, Grid, GridItem, Heading, Text, VStack,
  Button, HStack, Stat, Badge,
} from '@chakra-ui/react';

export default function SellerDashboard() {
  const { data: session } = useSession();
  const [tab, setTab]         = useState<'orders' | 'products'>('orders');
  const [orders, setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  async function fetchOrders() {
    const res  = await fetch('/api/orders?role=seller');
    const data = await res.json();
    setOrders(data.orders || []);
  }

  async function fetchProducts() {
    const res  = await fetch('/api/products');
    const data = await res.json();
    // only show this seller's products
    const mine = (data.products || []).filter(
      (p: Product) => p.seller_id === session?.user?.id
    );
    setProducts(mine);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (session?.user?.id) fetchProducts();
  }, [session]);

  async function markDelivered(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });
    if (res.ok) {
      toaster.create({ title: 'Marked as delivered. Waiting for buyer OTP.', type: 'info', duration: 3000 });
      fetchOrders();
    }
  }

  const totalEarnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pending   = orders.filter(o => ['in_escrow','paid','pending'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'completed').length;

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      {/* Tab nav */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6}>
        <HStack gap={0}>
          {[
            { key: 'orders'   as const, label: `📦 Orders${orders.length > 0 ? ` (${orders.length})` : ''}` },
            { key: 'products' as const, label: `🛍️ My Products${products.length > 0 ? ` (${products.length})` : ''}` },
          ].map(t => (
            <Box key={t.key} px={5} py={3} cursor="pointer"
              borderBottom="2px solid"
              borderColor={tab === t.key ? 'blue.600' : 'transparent'}
              color={tab === t.key ? 'blue.600' : 'gray.600'}
              fontWeight={tab === t.key ? 700 : 400}
              fontSize="sm"
              onClick={() => setTab(t.key)}
              _hover={{ color: 'blue.600' }}>
              {t.label}
            </Box>
          ))}
        </HStack>
      </Box>

      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6}>

          {/* ── ORDERS TAB ── */}
          {tab === 'orders' && (
            <>
              <Box>
                <Heading size="lg">Seller Dashboard — {session?.user?.name} 📦</Heading>
                <Text color="gray.500">Manage orders and update delivery status</Text>
              </Box>

              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                {[
                  { label: 'Total Orders',     value: orders.length,                       help: 'All time' },
                  { label: 'Pending Delivery', value: pending,                             help: 'In escrow' },
                  { label: 'Total Earned',     value: `${totalEarnings.toLocaleString()} RWF`, help: 'Completed' },
                ].map(s => (
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
                <Heading size="md" mb={4}>Your Orders</Heading>
                <VStack gap={3} align="stretch">
                  {orders.length === 0 ? (
                    <Box bg="white" p={8} borderRadius="xl" textAlign="center" color="gray.400">
                      No orders yet.
                    </Box>
                  ) : (
                    orders.map(order => (
                      <TransactionCard key={order.id} order={order}
                        actions={
                          ['in_escrow','paid','pending'].includes(order.status) ? (
                            <Button size="sm" colorPalette="blue"
                              onClick={() => markDelivered(order.id)}>
                              Mark as Delivered
                            </Button>
                          ) : null
                        }
                      />
                    ))
                  )}
                </VStack>
              </Box>
            </>
          )}

          {/* ── PRODUCTS TAB ── */}
          {tab === 'products' && (
            <>
              <Box>
                <Heading size="lg">My Products 🛍️</Heading>
                <Text color="gray.500">All products listed under your account</Text>
              </Box>

              {/* Summary stats */}
              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                {[
                  { label: 'Total Products', value: products.length,                             color: 'blue.600' },
                  { label: 'In Stock',       value: products.filter(p => p.in_stock).length,    color: 'green.600' },
                  { label: 'Categories',     value: [...new Set(products.map(p => p.category))].length, color: 'purple.600' },
                ].map(s => (
                  <GridItem key={s.label}>
                    <Box bg="white" p={5} borderRadius="xl" shadow="sm"
                      border="1px solid" borderColor="gray.200">
                      <Text color="gray.500" fontSize="sm">{s.label}</Text>
                      <Text fontSize="2xl" fontWeight="bold" color={s.color}>{s.value}</Text>
                    </Box>
                  </GridItem>
                ))}
              </Grid>

              {/* Products grid */}
              <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={5} w="full">
                {products.map(product => (
                  <GridItem key={product.id}>
                    <Box bg="white" borderRadius="2xl" shadow="sm"
                      border="1px solid" borderColor="gray.200" overflow="hidden">

                      {/* Image */}
                      <Box position="relative" h="180px" bg="gray.100">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                        <Box position="absolute" top={2} right={2}>
                          <Badge colorPalette={product.in_stock ? 'green' : 'red'}
                            borderRadius="full" fontSize="10px" px={2}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </Box>
                        <Box position="absolute" top={2} left={2}>
                          <Badge colorPalette="blue" borderRadius="full" fontSize="10px" px={2}>
                            {product.category}
                          </Badge>
                        </Box>
                      </Box>

                      {/* Info */}
                      <Box p={4}>
                        <VStack align="start" gap={1}>
                          <Text fontWeight="bold" fontSize="sm" lineClamp={1}>
                            {product.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500" lineClamp={2} minH="32px">
                            {product.description}
                          </Text>
                          <HStack justify="space-between" w="full" pt={1}>
                            <Text fontWeight="bold" color="blue.600" fontSize="md">
                              {Number(product.price).toLocaleString()} RWF
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {new Date(product.created_at).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </GridItem>
                ))}

                {products.length === 0 && (
                  <GridItem colSpan={4}>
                    <Box bg="white" p={10} borderRadius="xl" textAlign="center" color="gray.400">
                      No products found under your account.
                    </Box>
                  </GridItem>
                )}
              </Grid>
            </>
          )}

        </VStack>
      </Box>
    </Box>
  );
}