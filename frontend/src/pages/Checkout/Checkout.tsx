import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import "./Checkout.css";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod", // Cash on Delivery (الدفع عند الاستلام)
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Checkout | VELORA";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const shippingCost = cartItems.length > 0 ? 10 : 0;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // محاكاة إتمام الطلب بنجاح
    setIsSubmitted(true);
    clearCart(); // تفريغ السلة بعد الطلب
  };

  if (isSubmitted) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "16px" }}>Thank You for Your Order! 🎉</h1>
        <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}>
          We’ve received your order and are getting it ready for shipment. A confirmation email has been sent to your inbox.
        </p>
        <Link
          to="/products"
          style={{
            background: "#000",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "12px" }}>Your cart is empty</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>You need to add items to your bag before checking out.</p>
        <Link
          to="/products"
          style={{ background: "#000", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none" }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px" }}>Checkout</h1>

      <div className="checkout-layout" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
        {/* نموذج بيانات الشحن */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Shipping Details</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>Street Address</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "600", marginTop: "20px", marginBottom: "10px" }}>Payment Method</h2>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              Credit Card
            </label>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "20px",
              background: "#000",
              color: "#fff",
              padding: "14px",
              borderRadius: "6px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Place Order (${finalTotal})
          </button>
        </form>

        {/* ملخص الطلب الجانبي */}
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "24px",
            height: "fit-content",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Order Summary</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
            {cartItems.map((item) => (
              <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                <span>{item.product.name} (x{item.quantity})</span>
                <span style={{ fontWeight: "600" }}>${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", display: "flex", justifyContent: "space-between", color: "#4b5563", marginBottom: "8px" }}>
            <span>Subtotal</span>
            <span>${cartTotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#4b5563", marginBottom: "16px" }}>
            <span>Shipping</span>
            <span>${shippingCost}</span>
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px" }}>
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;