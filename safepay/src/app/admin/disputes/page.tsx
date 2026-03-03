"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { toaster } from "@/components/ui/toaster";
import { Dispute } from "@/types";
import {
  Box, Button, Grid, GridItem, Heading, Text, VStack, HStack,
  Badge, Textarea, DialogRoot, DialogContent, DialogHeader,
  DialogTitle, DialogBody, DialogCloseTrigger, Stat, Spinner,
  Link,
} from "@chakra-ui/react";

type DisputeExtended = Dispute & {
  item_name: string;
  amount: number;
  buyer_name: string;
  seller_name: string;
  payment_method?: string;
  tx_hash?: string;
  resolved_at?: string;
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes]     = useState<DisputeExtended[]>([]);
  const [selected, setSelected]     = useState<DisputeExtended | null>(null);
  const [resolution, setResolution] = useState("");
  const [open, setOpen]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);

  async function fetchDisputes() {
    setFetching(true);
    try {
      const res  = await fetch("/api/disputes");
      const data = await res.json();
      setDisputes(data.disputes || []);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { fetchDisputes(); }, []);

  function openResolution(d: DisputeExtended) {
    setSelected(d);
    setResolution(d.resolution || "");
    setOpen(true);
  }

  function isCrypto(d: DisputeExtended) {
    return d.payment_method === "crypto" || d.payment_method === "eth";
  }

  async function handleResolveRefund() {
    if (!selected) return;
    setLoading(true);

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dispute_id: selected.id,
        order_id:   selected.order_id,
        resolution: resolution || "Refund approved by admin",
      }),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toaster.create({
        title: "✅ Dispute resolved",
        description: data.tx_hash
          ? `On-chain tx: ${data.tx_hash.slice(0, 18)}…`
          : "Fiat refund processed",
        type: "success",
        duration: 5000,
      });
      setOpen(false);
      setSelected(null);
      setResolution("");
      fetchDisputes();
    } else {
      const data = await res.json().catch(() => ({}));
      toaster.create({
        title: data.error || "Failed to resolve dispute",
        type: "error",
        duration: 4000,
      });
    }
  }

  const openDisputes     = disputes.filter((d) => d.status === "open");
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved");

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6}>

          {/* Header */}
          <Box>
            <Heading size="lg">Disputes Management 🛡️</Heading>
            <Text color="gray.500">Review disputes and process refunds (fiat + on-chain)</Text>
          </Box>

          <HStack w="full" justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Last update: {new Date().toLocaleString()}
            </Text>
            <Button size="sm" variant="outline" onClick={fetchDisputes} loading={fetching}>
              Refresh
            </Button>
          </HStack>

          {/* Stats */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
            {[
              { label: "Total Disputes", value: disputes.length,          help: "All time"        },
              { label: "Open",           value: openDisputes.length,      help: "Needs attention" },
              { label: "Resolved",       value: resolvedDisputes.length,  help: "Closed"          },
            ].map((s) => (
              <GridItem key={s.label}>
                <Box bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Stat.Root>
                    <Stat.Label color="gray.500">{s.label}</Stat.Label>
                    <Stat.ValueText fontSize="2xl" color="blue.600">{s.value}</Stat.ValueText>
                    <Text fontSize="xs" color="gray.400">{s.help}</Text>
                  </Stat.Root>
                </Box>
              </GridItem>
            ))}
          </Grid>

          {/* Open Disputes */}
          <Box w="full">
            <Heading size="md" mb={4}>Open Disputes</Heading>
            <VStack gap={3} align="stretch">
              {fetching && <Spinner mx="auto" />}
              {!fetching && openDisputes.length === 0 && (
                <Box bg="white" p={8} borderRadius="xl" textAlign="center" color="gray.400">
                  No open disputes 🎉
                </Box>
              )}
              {openDisputes.map((d) => (
                <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm"
                  border="1px solid" borderColor="red.200">
                  <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                    <VStack align="start" gap={1}>
                      <HStack>
                        <Text fontWeight="bold">{d.item_name}</Text>
                        {isCrypto(d) && (
                          <Badge colorPalette="purple" size="sm">⛓ Crypto</Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Buyer: {d.buyer_name} · Seller: {d.seller_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Amount: {Number(d.amount).toLocaleString()} {isCrypto(d) ? "ETH" : "RWF"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Method: {(d.payment_method || "unknown").replace("_", " ")}
                      </Text>
                      <Text fontSize="sm" color="red.500">{d.reason}</Text>
                    </VStack>
                    <Button colorPalette="red" size="sm" onClick={() => openResolution(d)}>
                      {isCrypto(d) ? "⛓ Resolve & Refund On-Chain" : "Resolve & Refund"}
                    </Button>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Resolved Disputes */}
          {resolvedDisputes.length > 0 && (
            <Box w="full">
              <Heading size="md" mb={4}>Resolved Disputes</Heading>
              <VStack gap={3} align="stretch">
                {resolvedDisputes.map((d) => (
                  <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm"
                    border="1px solid" borderColor="green.200">
                    <VStack align="start" gap={1}>
                      <HStack justify="space-between" w="full">
                        <HStack>
                          <Text fontWeight="bold">{d.item_name}</Text>
                          {isCrypto(d) && (
                            <Badge colorPalette="purple" size="sm">⛓ Crypto</Badge>
                          )}
                        </HStack>
                        <Badge colorPalette="green">RESOLVED</Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Buyer: {d.buyer_name} · Seller: {d.seller_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Amount: {Number(d.amount).toLocaleString()} {isCrypto(d) ? "ETH" : "RWF"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Method: {(d.payment_method || "unknown").replace("_", " ")}
                      </Text>
                      {d.resolution && (
                        <Text fontSize="sm" color="green.600">↳ {d.resolution}</Text>
                      )}
                      {/* On-chain tx link */}
                      {d.tx_hash && (
                        <HStack>
                          <Text fontSize="xs" color="purple.500">⛓ TX:</Text>
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${d.tx_hash}`}
                            target="_blank"
                            fontSize="xs"
                            color="purple.500"
                            textDecoration="underline"
                          >
                            {d.tx_hash.slice(0, 20)}…
                          </Link>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

        </VStack>
      </Box>

      {/* Resolution Dialog */}
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent borderRadius="xl">
          <DialogHeader>
            <DialogTitle>
              Resolve Dispute {selected && isCrypto(selected) ? "⛓ (On-Chain Refund)" : ""}
            </DialogTitle>
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack align="stretch" gap={4}>
              {selected && isCrypto(selected) && (
                <Box bg="purple.50" p={3} borderRadius="md" border="1px solid" borderColor="purple.200">
                  <Text fontSize="sm" color="purple.700">
                    ⛓ This will call <strong>refundBuyer()</strong> on the smart contract and
                    return ETH directly to the buyer's wallet. The transaction is irreversible.
                  </Text>
                </Box>
              )}
              <Text fontSize="sm" color="gray.600">
                Add a resolution note and confirm the refund.
              </Text>
              <Textarea
                placeholder="Resolution details..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                minH="120px"
              />
              <Button
                colorPalette="red"
                onClick={handleResolveRefund}
                loading={loading}
                loadingText={selected && isCrypto(selected) ? "Submitting on-chain…" : "Processing…"}
              >
                {selected && isCrypto(selected)
                  ? "⛓ Confirm On-Chain Refund"
                  : "Confirm Resolve & Refund"}
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}