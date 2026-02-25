"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartService } from "@/services/cart.service";
import "./checkout.css";

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = sessionStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null;
            setUserId(user);

            if (user?.id) {
                fetchCartItems(user.id);
            } else {
                setErrorMessage("User not logged in.");
                setIsLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCartItems = async (id: string) => {
        try {
            const items = await CartService.getCartItems(id);
            setCartItems(items);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load cart items.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await CartService.removeFromCart(itemId);
            setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to remove item.");
        }
    };

    const proceedToPurchase = async () => {
        if (!cartItems.length) {
            setErrorMessage("Cart is empty.");
            return;
        }

        setIsProcessing(true);
        setSuccessMessage("");
        setErrorMessage("");

        const transactions = cartItems.map((item) => ({
            webinarId: item.webinar.id,
            userId: userId?.id,
            transactionId: `TXN\${Date.now()}`,
      amount: parseFloat(item.amount),
    }));

    let successfulRegistrations = 0;
    const totalTransactions = transactions.length;

    for (let i = 0; i < totalTransactions; i++) {
        const transaction = transactions[i];
      try {
        await CartService.registerForWebinar(transaction);
        successfulRegistrations++;

        // Remove item from the cart after successful registration
        await CartService.removeFromCart(cartItems[i].id).catch(console.error);

        if (successfulRegistrations === totalTransactions) {
          setSuccessMessage("✅ Successfully registered for all webinars!");
          setIsProcessing(false);

          setTimeout(() => {
            router.push("/webinar/masterclass"); // or proper default
          }, 2000);
        }
      } catch (error) {
        console.error("Error during purchase:", error);
        setErrorMessage("❌ Failed to complete some registrations. Please try again.");
        setIsProcessing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 py-5 text-center min-vh-100" style={{ paddingTop: "100px" }}>
        <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container min-vh-100" style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <h2 className="mb-4 fw-bold">Your Cart</h2>

      {errorMessage && <div className="alert alert-danger shadow-sm border-0 rounded-3">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success shadow-sm border-0 rounded-3">{successMessage}</div>}

      {cartItems.length === 0 ? (
        <div className="alert alert-info custom-alert shadow-sm border-0 rounded-3">
          Your cart is empty.{" "}
          <Link href="/webinar/masterclass" className="fw-bold">
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive shadow-sm rounded-3">
            <table className="table table-hover table-striped table-bordered mb-0 bg-white">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="py-3">Event Title</th>
                  <th className="py-3">Coupon Code</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Start Date</th>
                  <th className="py-3">End Date</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="align-middle fw-semibold">{item.webinar.title}</td>
                    <td className="align-middle">{item.coupon_code || "N/A"}</td>
                    <td className="align-middle">
                      {item.amount === "0.00" || item.amount === 0 ? "FREE" : `INR \${item.amount}`}
                    </td>
                    <td className="align-middle">
                      {new Date(item.webinar.start_time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="align-middle">
                      {new Date(item.webinar.end_time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="align-middle text-center">
                      <span
                        className={`badge \${
                          item.is_checked_out ? "bg-success" : "bg-warning text-dark"
                        } px-3 py-2 rounded-pill`}
                      >
                        {item.is_checked_out ? "Checked Out" : "Pending"}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-3 fw-bold px-3"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash me-1"></i> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end mt-4">
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
                onClick={proceedToPurchase}
                disabled={isProcessing}
                style={{ background: "linear-gradient(90deg, #2563eb, #1e40af)", border: "none" }}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i> Processing...
                  </>
                ) : (
                  "Proceed to Purchase"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
