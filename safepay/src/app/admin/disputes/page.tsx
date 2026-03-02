"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { toaster } from "@/components/ui/toaster";
import { Dispute } from "@/types";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Textarea,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  Stat,
} from "@chakra-ui/react";

type DisputeExtended = Dispute & {
  item_name: string;
  amount: number;
  buyer_name: string;
  seller_name: string;
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeExtended[]>([]);
  const [selected, setSelected] = useState<DisputeExtended | null>(null);
  const [resolution, setResolution] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchDisputes() {
    const res = await fetch("/api/disputes");
    const data = await res.json();
    setDisputes(data.disputes || []);
  }

  useEffect(() => {
    fetchDisputes();
  }, []);

  function openResolution(d: DisputeExtended) {
    setSelected(d);
    setResolution(d.resolution || "");
    setOpen(true);
  }

  async function handleResolveRefund() {
    if (!selected) return;
    setLoading(true);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dispute_id: selected.id,
        order_id: selected.order_id,
        resolution: resolution || "Refund approved by admin",
      }),
    });
    setLoading(false);

    if (res.ok) {
      toaster.create({
        title: "✅ Dispute resolved and refund issued",
        type: "success",
        duration: 3500,
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

  const openDisputes = disputes.filter((d) => d.status === "open");
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved");

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6}>
          <Box>
            <Heading size="lg">Disputes Management 🛡️</Heading>
            <Text color="gray.500">Review disputes and process refunds</Text>
          </Box>

          <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
            {[
              { label: "Total Disputes", value: disputes.length, help: "All time" },
              { label: "Open", value: openDisputes.length, help: "Needs attention" },
              { label: "Resolved", value: resolvedDisputes.length, help: "Closed" },
            ].map((s) => (
              <GridItem key={s.label}>
                <Box bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
                  <Stat.Root>
                    <Stat.Label color="gray.500">{s.label}</Stat.Label>
                    <Stat.ValueText fontSize="2xl" color="blue.600">
                      {s.value}
                    </Stat.ValueText>
                    <Text fontSize="xs" color="gray.400">
                      {s.help}
                    </Text>
                  </Stat.Root>
                </Box>
              </GridItem>
            ))}
          </Grid>

          <Box w="full">
            <Heading size="md" mb={4}>
              Open Disputes
            </Heading>
            <VStack gap={3} align="stretch">
              {openDisputes.length === 0 && (
                <Box bg="white" p={8} borderRadius="xl" textAlign="center" color="gray.400">
                  No open disputes
                </Box>
              )}
              {openDisputes.map((d) => (
                <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="red.200">
                  <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold">{d.item_name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Buyer: {d.buyer_name} · Seller: {d.seller_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Amount: {Number(d.amount).toLocaleString()} RWF
                      </Text>
                      <Text fontSize="sm" color="red.500">
                        {d.reason}
                      </Text>
                    </VStack>
                    <Button colorPalette="red" size="sm" onClick={() => openResolution(d)}>
                      Resolve & Refund
                    </Button>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Box>

          {resolvedDisputes.length > 0 && (
            <Box w="full">
              <Heading size="md" mb={4}>
                Resolved Disputes
              </Heading>
              <VStack gap={3} align="stretch">
                {resolvedDisputes.map((d) => (
                  <Box key={d.id} bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="green.200">
                    <VStack align="start" gap={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="bold">{d.item_name}</Text>
                        <Badge colorPalette="green">RESOLVED</Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Buyer: {d.buyer_name} · Seller: {d.seller_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Amount: {Number(d.amount).toLocaleString()} RWF
                      </Text>
                      {d.resolution && (
                        <Text fontSize="sm" color="green.600">
                          ↳ {d.resolution}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent borderRadius="xl">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack align="stretch" gap={4}>
              <Text fontSize="sm" color="gray.600">
                Add a resolution note and confirm refund for this order.
              </Text>
              <Textarea
                placeholder="Resolution details"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                minH="120px"
              />
              <Button colorPalette="red" onClick={handleResolveRefund} loading={loading}>
                Confirm Resolve & Refund
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
