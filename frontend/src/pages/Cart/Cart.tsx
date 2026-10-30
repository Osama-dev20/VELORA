import { useEffect } from "react";
import { Link } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Shopping Bag | VELORA";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const shipping = cartItems.length > 0 ? 10 : 0; // تكلفة شحن ثابتة كمثال
  const total = cartTotal + shipping;

  return (
    <div className="cart-page" style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <header className="cart-header" style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700" }}>Your Shopping Bag</h1>
        <p style={{ color: "#666", marginTop: "5px" }}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your bag
        </p>
      </header>

      {cartItems.length > 0 ? (
        <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "40px" }}>
          {/* قائمة المنتجات */}
          <div className="cart-items-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#fff",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: "90px", height: "110px", objectFit: "cover", borderRadius: "6px" }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{item.product.name}</h3>
                  <p style={{ color: "#666", fontSize: "14px", margin: "4px 0" }}>Category: {item.product.category}</p>
                  <p style={{ fontWeight: "700", marginTop: "8px" }}>${item.product.price}</p>
                </div>

                {/* أزرار التحكم بالكمية */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid #ddd", borderRadius: "4px", padding: "4px 8px" }}>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>

                {/* السعر الإجمالي للمنتج الواحد مع الكمية */}
                <div style={{ minWidth: "70px", textAlign: "right", fontWeight: "700" }}>
                  ${item.product.price * item.quantity}
                </div>

                {/* زر الحذف */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "5px" }}
                  title="Remove item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ملخص الطلب (Order Summary) */}
          <div
            className="cart-summary"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "24px",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Order Summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#4b5563" }}>
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "#4b5563" }}>
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px", marginBottom: "24px" }}>
              <span>Total</span>
              <span>${total}</span>
            </div>

            <Link
              to="/checkout"
              style={{
                display: "block",
                background: "#000",
                color: "#fff",
                textAlign: "center",
                padding: "14px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "background 0.2s",
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      ) : (
        /* في حال كانت السلة فارغة */
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <ShoppingBagOutlinedIcon style={{ fontSize: "64px", color: "#9ca3af", marginBottom: "16px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Your bag is empty</h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>Discover our collections and add your favorite pieces to the bag.</p>
          <Link
            to="/products"
            style={{
              background: "#000",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;