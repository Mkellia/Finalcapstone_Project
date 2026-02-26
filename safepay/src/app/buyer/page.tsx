"use client";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Order, Product } from "@/types";

import {
  Box, Grid, GridItem, Heading, Text, VStack, Button,
  HStack, Input, Field, Stat, Badge, Textarea, Separator,
} from '@chakra-ui/react';

const CATEGORIES = ['All', 'Shoes', 'Bags', 'Electronics', 'Fashion', 'Accessories', 'Beauty'];

const STATUS_COLOR: Record<string, string> = {
  pending:   'yellow',
  paid:      'blue',
  in_escrow: 'purple',
  delivered: 'cyan',
  completed: 'green',
  disputed:  'red',
  refunded:  'orange',
};

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'shop' | 'orders'>(
    searchParams.get('tab') === 'orders' ? 'orders' : 'shop'
  );

  // shop
  const [products, setProducts]   = useState<Product[]>([]);
  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');
  const [fetching, setFetching]   = useState(true);

  // orders
  const [orders, setOrders] = useState<Order[]>([]);

  // buy dialog
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [payMethod, setPayMethod]   = useState('mobile_money');
  const [buyLoading, setBuyLoading] = useState(false);

  // otp dialog
  const [otpOrder, setOtpOrder]         = useState<Order | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput]         = useState('');
  const [otpLoading, setOtpLoading]     = useState(false);

  // dispute dialog
  const [disputeOrder, setDisputeOrder]     = useState<Order | null>(null);
  const [disputeReason, setDisputeReason]   = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────
  async function fetchProducts(cat = 'All') {
    setFetching(true);
    const url  = cat === 'All' ? '/api/products' : `/api/products?category=${encodeURIComponent(cat)}`;
    const res  = await fetch(url);
    const data = await res.json();
    setProducts(data.products || []);
    setFetching(false);
  }

  async function fetchOrders() {
    const res  = await fetch('/api/orders?role=buyer');
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  // ── Buy ────────────────────────────────────────────────
  async function handleBuy() {
    if (!selectedProduct) return;
    setBuyLoading(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seller_id:      selectedProduct.seller_id,
        item_name:      selectedProduct.name,
        amount:         selectedProduct.price,
        payment_method: payMethod,
      }),
    });
    setBuyLoading(false);

    if (res.ok) {
      toaster.create({ title: '✅ Order placed! Payment locked in escrow.', type: 'success', duration: 4000 });
      setSelectedProduct(null);
      await fetchOrders();
      setTab('orders');
    } else {
      toaster.create({ title: 'Failed to place order', type: 'error', duration: 3000 });
    }
  }

  // ── OTP ────────────────────────────────────────────────
  async function handleGenerateOtp() {
    if (!otpOrder) return;
    setOtpLoading(true);
    const res  = await fetch('/api/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: otpOrder.id, action: 'generate' }),
    });
    const data = await res.json();
    setOtpLoading(false);
  
    if (res.ok) {
      setGeneratedOtp(data.otp); // always show on screen
      if (data.email_sent) {
        toaster.create({
          title: `📧 OTP also sent to ${session?.user?.email}`,
          type: 'info', duration: 4000,
        });
      } else {
        toaster.create({
          title: '⚠️ Email unavailable — use the code shown on screen',
          type: 'warning', duration: 6000,
        });
      }
    } else {
      toaster.create({ title: data.error || 'Failed to generate OTP', type: 'error', duration: 3000 });
    }
  }

  async function handleVerifyOtp() {
    if (!otpOrder || !otpInput) return;
    setOtpLoading(true);
    const res  = await fetch('/api/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: otpOrder.id, action: 'verify', otp_token: otpInput }),
    });
    const data = await res.json();
    setOtpLoading(false);
    if (res.ok) {
      toaster.create({ title: '✅ Delivery confirmed! Payment released.', type: 'success', duration: 5000 });
      setOtpOrder(null);
      setGeneratedOtp(null);
      setOtpInput('');
      fetchOrders();
    } else {
      toaster.create({ title: data.error || 'Invalid OTP', type: 'error', duration: 3000 });
    }
  }

  // ── Dispute ────────────────────────────────────────────
  async function handleOpenDispute() {
    if (!disputeOrder || !disputeReason.trim()) return;
    setDisputeLoading(true);
    const res = await fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: disputeOrder.id, reason: disputeReason }),
    });
    setDisputeLoading(false);
    if (res.ok) {
      toaster.create({ title: '⚠️ Dispute opened. Admin will review shortly.', type: 'warning', duration: 5000 });
      setDisputeOrder(null);
      setDisputeReason('');
      fetchOrders();
    } else {
      toaster.create({ title: 'Failed to open dispute', type: 'error', duration: 3000 });
    }
  }

  // ── Stats ──────────────────────────────────────────────
  const completed = orders.filter(o => o.status === 'completed').length;
  const inEscrow  = orders.filter(o => ['in_escrow','paid','pending'].includes(o.status)).length;
  const disputed  = orders.filter(o => o.status === 'disputed').length;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  type OrderWithSeller = Order & { seller_name?: string };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      {/* Tab nav */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6}>
        <HStack gap={0}>
          {[
            { key: 'shop'   as const, label: '🛍️ Shop' },
            { key: 'orders' as const, label: `📦 My Orders${orders.length > 0 ? ` (${orders.length})` : ''}` },
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

          {/* ══ SHOP ═════════════════════════════════════════ */}
          {tab === 'shop' && !selectedProduct && (
            <>
              <Box>
                <Heading size="lg">Welcome, {session?.user?.name} 👋</Heading>
                <Text color="gray.500" fontSize="sm">
                  Browse products — payments held in escrow until you confirm delivery.
                </Text>
              </Box>

              <Input placeholder="🔍 Search products..." value={search}
                onChange={e => setSearch(e.target.value)} bg="white" maxW="360px" />

              <HStack gap={2} flexWrap="wrap">
                {CATEGORIES.map(cat => (
                  <Button key={cat} size="sm" borderRadius="full"
                    variant={category === cat ? 'solid' : 'outline'}
                    colorPalette="blue"
                    onClick={() => { setCategory(cat); fetchProducts(cat); }}>
                    {cat}
                  </Button>
                ))}
              </HStack>

              {fetching ? (
                <Box w="full" textAlign="center" py={20} color="gray.400">Loading products...</Box>
              ) : (
                <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={5} w="full">
                  {filtered.map(product => (
                    <GridItem key={product.id}>
                      <Box bg="white" borderRadius="2xl" shadow="sm"
                        border="1px solid" borderColor="gray.200" overflow="hidden"
                        transition="all 0.2s"
                        _hover={{ shadow: 'lg', transform: 'translateY(-3px)' }}>

                        <Box position="relative" h="190px" bg="gray.100">
                          <Image src={product.image_url} alt={product.name}
                            fill style={{ objectFit: 'cover' }} unoptimized />
                          <Box position="absolute" top={2} right={2}>
                            <Badge colorPalette="blue" borderRadius="full" fontSize="10px" px={2}>
                              {product.category}
                            </Badge>
                          </Box>
                        </Box>

                        <Box p={4}>
                          <VStack align="start" gap={2}>
                            <Text fontWeight="bold" fontSize="sm" lineClamp={1}>{product.name}</Text>
                            <Text fontSize="xs" color="gray.500" lineClamp={2} minH="32px">
                              {product.description}
                            </Text>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" color="blue.600" fontSize="md">
                                {Number(product.price).toLocaleString()} RWF
                              </Text>
                              <Text fontSize="10px" color="gray.400">{product.seller_name}</Text>
                            </HStack>
                            <Button w="full" colorPalette="blue" size="sm" borderRadius="lg"
                              onClick={() => setSelectedProduct(product)}>
                              🔐 Buy with Escrow
                            </Button>
                          </VStack>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                  {filtered.length === 0 && (
                    <GridItem colSpan={4}>
                      <Box bg="white" p={10} borderRadius="xl" textAlign="center" color="gray.400">
                        No products found
                      </Box>
                    </GridItem>
                  )}
                </Grid>
              )}
            </>
          )}

          {/* ══ BUY CONFIRMATION — inline, no dialog ════════ */}
          {tab === 'shop' && selectedProduct && (
            <Box w="full" maxW="520px" mx="auto">
              <HStack mb={4}>
                <Button variant="ghost" size="sm" colorPalette="blue"
                  onClick={() => setSelectedProduct(null)}>
                  ← Back to Shop
                </Button>
              </HStack>

              <Box bg="white" borderRadius="2xl" shadow="sm"
                border="1px solid" borderColor="gray.200" overflow="hidden">

                <Box position="relative" h="240px">
                  <Image src={selectedProduct.image_url} alt={selectedProduct.name}
                    fill style={{ objectFit: 'cover' }} unoptimized />
                </Box>

                <Box p={6}>
                  <VStack align="start" gap={4}>
                    <Box>
                      <Text fontWeight="bold" fontSize="xl">{selectedProduct.name}</Text>
                      <Text fontSize="sm" color="gray.500" mt={1}>{selectedProduct.description}</Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        Sold by {selectedProduct.seller_name}
                      </Text>
                    </Box>

                    <HStack justify="space-between" w="full" bg="blue.50"
                      p={4} borderRadius="lg">
                      <Text fontWeight="semibold" color="blue.700">Total Amount</Text>
                      <Text fontWeight="bold" fontSize="2xl" color="blue.600">
                        {Number(selectedProduct.price).toLocaleString()} RWF
                      </Text>
                    </HStack>

                    <Box w="full" bg="yellow.50" border="1px solid" borderColor="yellow.200"
                      borderRadius="lg" p={3}>
                      <Text fontSize="xs" color="yellow.800">
                        🔐 Your payment is held in escrow and only released to the seller after you confirm delivery with an OTP code.
                      </Text>
                    </Box>

                    <Field.Root w="full">
                      <Field.Label>Payment Method</Field.Label>
                      <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                        style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                          border:'1px solid #E2E8F0', fontSize:'14px', background:'white' }}>
                        <option value="mobile_money">📱 Mobile Money</option>
                        <option value="bank_transfer">🏦 Bank Transfer</option>
                      </select>
                    </Field.Root>

                    <Button w="full" colorPalette="blue" size="lg" borderRadius="xl"
                      onClick={handleBuy} loading={buyLoading}
                      loadingText="Placing order...">
                      🔐 Place Order & Lock in Escrow
                    </Button>
                  </VStack>
                </Box>
              </Box>
            </Box>
          )}

          {/* ══ ORDERS ═══════════════════════════════════════ */}
          {tab === 'orders' && !otpOrder && !disputeOrder && (
            <>
              <Box>
                <Heading size="lg">My Orders</Heading>
                <Text color="gray.500">Track purchases and confirm deliveries</Text>
              </Box>

              <Grid templateColumns="repeat(4, 1fr)" gap={4} w="full">
                {[
                  { label: 'Total',     value: orders.length, color: 'blue.600' },
                  { label: 'In Escrow', value: inEscrow,      color: 'purple.600' },
                  { label: 'Completed', value: completed,     color: 'green.600' },
                  { label: 'Disputed',  value: disputed,      color: 'red.600' },
                ].map(s => (
                  <GridItem key={s.label}>
                    <Box bg="white" p={4} borderRadius="xl" shadow="sm"
                      border="1px solid" borderColor="gray.200">
                      <Stat.Root>
                        <Stat.Label color="gray.500" fontSize="xs">{s.label}</Stat.Label>
                        <Stat.ValueText fontSize="2xl" color={s.color}>{s.value}</Stat.ValueText>
                      </Stat.Root>
                    </Box>
                  </GridItem>
                ))}
              </Grid>

              <VStack gap={3} align="stretch" w="full">
                {orders.length === 0 ? (
                  <Box bg="white" p={10} borderRadius="xl" textAlign="center">
                    <Text color="gray.400" mb={3}>No orders yet.</Text>
                    <Button colorPalette="blue" size="sm" onClick={() => setTab('shop')}>
                      Browse Products →
                    </Button>
                  </Box>
                ) : (
                  orders.map(order => {
                    const o = order as OrderWithSeller;
                    return (
                      <Box key={order.id} bg="white" borderRadius="xl" shadow="sm"
                        border="1px solid" borderColor="gray.200" p={5}>
                        <VStack align="start" gap={3}>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="bold">{order.item_name}</Text>
                            <Badge colorPalette={STATUS_COLOR[order.status]}
                              borderRadius="full" px={3}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </HStack>

                          <Separator />

                          <HStack gap={6} flexWrap="wrap">
                            <VStack align="start" gap={0}>
                              <Text fontSize="xs" color="gray.400">Amount</Text>
                              <Text fontWeight="semibold">{Number(order.amount).toLocaleString()} RWF</Text>
                            </VStack>
                            {o.seller_name && (
                              <VStack align="start" gap={0}>
                                <Text fontSize="xs" color="gray.400">Seller</Text>
                                <Text fontWeight="semibold">{o.seller_name}</Text>
                              </VStack>
                            )}
                            <VStack align="start" gap={0}>
                              <Text fontSize="xs" color="gray.400">Date</Text>
                              <Text fontWeight="semibold">
                                {new Date(order.created_at).toLocaleDateString()}
                              </Text>
                            </VStack>
                          </HStack>

                          {/* Status-based actions */}
                          {order.status === 'delivered' && (
                            <HStack gap={2} pt={1} flexWrap="wrap">
                              <Button size="sm" colorPalette="green"
                                onClick={() => { setOtpOrder(order); setGeneratedOtp(null); setOtpInput(''); }}>
                                ✅ Confirm Delivery (OTP)
                              </Button>
                              <Button size="sm" colorPalette="red" variant="outline"
                                onClick={() => { setDisputeOrder(order); setDisputeReason(''); }}>
                                ⚠️ Open Dispute
                              </Button>
                            </HStack>
                          )}
                          {['pending','paid','in_escrow'].includes(order.status) && (
                            <HStack gap={2} pt={1}>
                              <Box bg="blue.50" px={3} py={2} borderRadius="lg" flex={1}>
                                <Text fontSize="xs" color="blue.600">
                                  🔐 Payment locked — waiting for seller to mark as delivered
                                </Text>
                              </Box>
                              <Button size="xs" colorPalette="red" variant="ghost"
                                onClick={() => { setDisputeOrder(order); setDisputeReason(''); }}>
                                Dispute
                              </Button>
                            </HStack>
                          )}
                          {order.status === 'completed' && (
                            <Box bg="green.50" px={3} py={2} borderRadius="lg">
                              <Text fontSize="xs" color="green.600">✅ Delivered — payment released to seller</Text>
                            </Box>
                          )}
                          {order.status === 'refunded' && (
                            <Box bg="orange.50" px={3} py={2} borderRadius="lg">
                              <Text fontSize="xs" color="orange.600">💰 Refunded by admin</Text>
                            </Box>
                          )}
                          {order.status === 'disputed' && (
                            <Box bg="red.50" px={3} py={2} borderRadius="lg">
                              <Text fontSize="xs" color="red.600">⚠️ Dispute under review</Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    );
                  })
                )}
              </VStack>
            </>
          )}

          {/* ══ OTP CONFIRMATION — inline ════════════════════ */}
{tab === 'orders' && otpOrder && (
  <Box w="full" maxW="520px" mx="auto">
    <HStack mb={4}>
      <Button variant="ghost" size="sm" colorPalette="blue"
        onClick={() => { setOtpOrder(null); setGeneratedOtp(null); setOtpInput(''); }}>
        ← Back to Orders
      </Button>
    </HStack>

    <Box bg="white" borderRadius="2xl" shadow="sm"
      border="1px solid" borderColor="gray.200" p={6}>
      <VStack gap={5} align="start">

        <Box>
          <Heading size="md">Confirm Delivery</Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Verify you received your item to release payment to the seller.
          </Text>
        </Box>

        {/* Order summary */}
        <Box w="full" bg="blue.50" border="1px solid" borderColor="blue.100"
          borderRadius="xl" p={4}>
          <Text fontWeight="bold" color="blue.700">{otpOrder.item_name}</Text>
          <Text fontSize="sm" color="blue.600">
            {Number(otpOrder.amount).toLocaleString()} RWF · locked in escrow
          </Text>
        </Box>

        {/* Step 1 — send OTP to email */}
        <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
          <HStack mb={3}>
            <Box w={6} h={6} borderRadius="full" bg="blue.600"
              display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" fontWeight="bold" color="white">1</Text>
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Send OTP to your email
            </Text>
          </HStack>

          {!generatedOtp ? (
            <VStack gap={2} align="start">
              <Text fontSize="xs" color="gray.500">
                We will send a 6-digit OTP to{' '}
                <Text as="span" fontWeight="semibold" color="blue.600">
                  {session?.user?.email}
                </Text>
              </Text>
              <Button w="full" colorPalette="blue" variant="outline"
                onClick={handleGenerateOtp} loading={otpLoading}
                loadingText="Sending OTP...">
                📧 Send OTP to My Email
              </Button>
            </VStack>
          ) : (
            <Box bg="green.50" border="1px solid" borderColor="green.200"
              borderRadius="lg" p={3}>
              <HStack>
                <Text fontSize="lg">✅</Text>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" fontWeight="semibold" color="green.700">
                    OTP sent successfully!
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    Check your email — {session?.user?.email}
                  </Text>
                  <Text fontSize="xs" color="green.500">⏱ Expires in 5 minutes</Text>
                </VStack>
              </HStack>
              <Button mt={2} size="xs" variant="ghost" colorPalette="blue"
                onClick={() => { setGeneratedOtp(null); }}> 
                Resend OTP
              </Button>
            </Box>
          )}
        </Box>

        {/* Step 2 — enter OTP */}
        <Box w="full" border="1px solid"
          borderColor={generatedOtp ? 'blue.200' : 'gray.100'}
          borderRadius="xl" p={4}
          opacity={generatedOtp ? 1 : 0.5}>
          <HStack mb={3}>
            <Box w={6} h={6} borderRadius="full"
              bg={generatedOtp ? 'blue.600' : 'gray.300'}
              display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" fontWeight="bold" color="white">2</Text>
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Enter OTP from your email
            </Text>
          </HStack>

          <VStack gap={3}>
            <Input
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              maxLength={6}
              textAlign="center"
              fontSize="2xl"
              letterSpacing="8px"
              fontWeight="bold"
              disabled={!generatedOtp}
              bg={generatedOtp ? 'white' : 'gray.50'}
            />

            <Button w="full" colorPalette="green" size="lg"
              onClick={handleVerifyOtp}
              disabled={otpInput.length !== 6 || !generatedOtp}
              loading={otpLoading}
              loadingText="Verifying...">
              ✅ Confirm Delivery & Release Payment
            </Button>
          </VStack>
        </Box>

        {/* Warning */}
        <Box w="full" bg="yellow.50" border="1px solid" borderColor="yellow.200"
          borderRadius="lg" p={3}>
          <Text fontSize="xs" color="yellow.800">
            ⚠️ Only confirm delivery after you have <strong>physically received</strong> your item.
            Once confirmed, payment is permanently released to the seller.
          </Text>
        </Box>

      </VStack>
    </Box>
  </Box>
)}

          {/* ══ DISPUTE — inline ═════════════════════════════ */}
          {tab === 'orders' && disputeOrder && (
            <Box w="full" maxW="520px" mx="auto">
              <HStack mb={4}>
                <Button variant="ghost" size="sm" colorPalette="blue"
                  onClick={() => { setDisputeOrder(null); setDisputeReason(''); }}>
                  ← Back to Orders
                </Button>
              </HStack>

              <Box bg="white" borderRadius="2xl" shadow="sm"
                border="1px solid" borderColor="gray.200" p={6}>
                <VStack gap={4} align="start">
                  <Box>
                    <Heading size="md">Open a Dispute</Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Admin will review and issue a refund if applicable.
                    </Text>
                  </Box>

                  <Box w="full" bg="red.50" border="1px solid" borderColor="red.100"
                    borderRadius="xl" p={4}>
                    <Text fontWeight="bold" color="red.700">{disputeOrder.item_name}</Text>
                    <Text fontSize="sm" color="red.600">
                      {Number(disputeOrder.amount).toLocaleString()} RWF
                    </Text>
                  </Box>

                  <Field.Root w="full">
                    <Field.Label>Describe the issue</Field.Label>
                    <Textarea
                      value={disputeReason}
                      onChange={e => setDisputeReason(e.target.value)}
                      placeholder="e.g. Item was not delivered, wrong item received, item damaged on arrival..."
                      rows={5}
                    />
                  </Field.Root>

                  <Button w="full" colorPalette="red" size="lg"
                    onClick={handleOpenDispute}
                    disabled={!disputeReason.trim()}
                    loading={disputeLoading}
                    loadingText="Submitting...">
                    ⚠️ Submit Dispute
                  </Button>
                </VStack>
              </Box>
            </Box>
          )}

        </VStack>
      </Box>
    </Box>
  );
}