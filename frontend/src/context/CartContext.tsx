import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// استيراد Product من ملف الـ types المركزي
import type { Product } from "../type/product";

export type { Product }; // لإعادة تصديره لمن يحتاجه

/* Cart Item Type */

export type CartItem = {
  product: Product;
  quantity: number;
};

/* Context Type */

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

/* Create Context */

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

/* Provider */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("velora-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  /* Save Cart */

  useEffect(() => {
    localStorage.setItem("velora-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* Add Product */

  const addToCart = (product: Product) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousItems, { product, quantity: 1 }];
    });
  };

  /* Remove Product */

  const removeFromCart = (productId: string) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  /* Update Quantity */

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  /* Clear Cart */

  const clearCart = () => {
    setCartItems([]);
  };

  /* Cart Count */

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* Cart Total */

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* Custom Hook */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}