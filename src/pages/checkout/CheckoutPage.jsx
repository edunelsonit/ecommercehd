import "../css/Checkout.css";
import { Link } from "react-router";
import axios from "axios";
import "../css/checkout-header.css";
import { useState, useEffect } from "react";
import { PaymentSummary } from "./PaymentSummary";
import { CartItemsPage } from "./CartItemsPage";

export function CheckoutPage({ cart, loadCart}) {
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  const [deliveryOptions, setDeliveryOptions] = useState([]);

  const [paymentSummary, setPaymentSumary] = useState([null]);

  useEffect(() => {
    axios
      .get("/api/delivery-options?expand=estimatedDeliveryTime")
      .then((response) => {
        setDeliveryOptions(response.data);
      });

    axios.get("/api/payment-summary").then((response) => {
      setPaymentSumary(response.data);
    });
  }, [cart]);

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <Link className="return-to-home-link" to="/">
              {totalQuantity} items
            </Link>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>
      {paymentSummary && (
        <>
          <div className="checkout-page">
            <div className="page-title">Review your order</div>

            <div className="checkout-grid">
              <div className="order-summary">
                
                {deliveryOptions.length > 0 &&
                  cart.map((cartItem) => {
                    
                    const selectedDeliveryOption = deliveryOptions.find(
                      (deliveryOption) => {
                        return deliveryOption.id === cartItem.deliveryOptionId;
                      },
                    );

                    return (
                      <>
                        <CartItemsPage cartItem={cartItem} selectedDeliveryOption={selectedDeliveryOption} deliveryOptions={deliveryOptions} loadCart={loadCart}/>
                      </>
                    );
                  })}
              </div>
            </div>
            <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart}/>
          </div>
        </>
      )}
    </>
  );
}
