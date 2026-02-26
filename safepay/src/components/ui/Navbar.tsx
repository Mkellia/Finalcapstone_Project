"use client";
import Link from "next/link";
import { Avatar, Box, Button, Flex, HStack, MenuContent, MenuItem, MenuRoot, MenuTrigger, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <Box bg="blue.600" px={6} py={4} shadow="md">
      <Flex justify="space-between" align="center">
        <Link href="/">
          <Text fontSize="xl" fontWeight="bold" color="white" letterSpacing="wide">
            🔐 SafePay
          </Text>
        </Link>
        <HStack gap={4}>
          <Text color="whiteAlpha.900" fontSize="sm">
            {session?.user?.role?.toUpperCase()}
          </Text>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" p={0} minW="auto">
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg="blue.800" color="white">
                    {session?.user?.name?.[0] ?? '?'}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="email" disabled>{session?.user?.email}</MenuItem>
              <MenuItem value="signout" color="red.500"
                onClick={() => signOut({ callbackUrl: '/login' })}>
                Sign Out
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
      </Flex>
    </Box>
  );
}