// lib/cart-validation.ts
// Call validateCartForCrypto() before opening MetaMask.
// Returns a list of item names whose sellers have no wallet configured.

/**
 * Local CartItem type used by this module.
 * If you have a central types file, replace this with the correct import.
 */
type CartItem = {
  name: string;
  seller_wallet_address?: string | null;
  [key: string]: any;
};

export function validateCartForCrypto(cart: CartItem[]): string[] {
  return cart
    .filter(item => !item.seller_wallet_address)
    .map(item => item.name);
}