"use client";
import { Badge, Box, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { Order } from "@/types";

const statusColor: Record<string, string> = {
  pending:   'yellow',
  paid:      'blue',
  in_escrow: 'purple',
  delivered: 'cyan',
  completed: 'green',
  disputed:  'red',
  refunded:  'orange',
};

interface Props {
  order: Order & { buyer_name?: string; seller_name?: string };
  actions?: React.ReactNode;
}

export default function TransactionCard({ order, actions }: Props) {
  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={5} bg="white" shadow="sm">
      <VStack align="start" gap={3}>
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" fontSize="md">{order.item_name}</Text>
          <Badge colorPalette={statusColor[order.status]} borderRadius="full" px={3}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </HStack>
        <Separator />
        <HStack gap={6}>
          <VStack align="start" gap={0}>
            <Text fontSize="xs" color="gray.500">Amount</Text>
            <Text fontWeight="semibold">{order.amount.toLocaleString()} RWF</Text>
          </VStack>
          {order.buyer_name && (
            <VStack align="start" gap={0}>
              <Text fontSize="xs" color="gray.500">Buyer</Text>
              <Text fontWeight="semibold">{order.buyer_name}</Text>
            </VStack>
          )}
          {order.seller_name && (
            <VStack align="start" gap={0}>
              <Text fontSize="xs" color="gray.500">Seller</Text>
              <Text fontWeight="semibold">{order.seller_name}</Text>
            </VStack>
          )}
          <VStack align="start" gap={0}>
            <Text fontSize="xs" color="gray.500">Date</Text>
            <Text fontWeight="semibold">{new Date(order.created_at).toLocaleDateString()}</Text>
          </VStack>
        </HStack>
        {order.tx_hash && (
          <Text fontSize="xs" color="gray.400" truncate>TX: {order.tx_hash}</Text>
        )}
        {actions && <Box w="full" pt={2}>{actions}</Box>}
      </VStack>
    </Box>
  );
}