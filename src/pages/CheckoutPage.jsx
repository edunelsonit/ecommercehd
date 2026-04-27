import { formatMoney } from "../utils/money";
import "./css/Checkout.css";
import { Link } from "react-router";
import axios from "axios";
import "./css/checkout-header.css";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
export function CheckoutPage({ cart }) {
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
  }, []);

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
                        <div
                          className="cart-item-container"
                          key={cartItem.product.id}
                        >
                          <div className="delivery-date">
                            Delivery date:{" "}
                            {dayjs(selectedDeliveryOption.deliveryDate).format(
                              "dddd, MMMM, D",
                            )}
                          </div>

                          <div className="cart-item-details-grid">
                            <img
                              className="product-image"
                              src={cartItem.product.image}
                            />

                            <div className="cart-item-details">
                              <div className="product-name">
                                {cartItem.product.name}
                              </div>
                              <div className="product-price">
                                {formatMoney(cartItem.product.priceCents)}
                              </div>
                              <div className="product-quantity">
                                <span>
                                  Quantity:{" "}
                                  <span className="quantity-label">
                                    {cartItem.product.quantity}
                                  </span>
                                </span>
                                <span className="update-quantity-link link-primary">
                                  Update
                                </span>
                                <span className="delete-quantity-link link-primary">
                                  Delete
                                </span>
                              </div>
                            </div>

                            <div className="delivery-options">
                              <div className="delivery-options-title">
                                Choose a delivery option:
                              </div>
                              {deliveryOptions.map((deliveryOption) => {
                                let priceString = "Free Shipping";

                                if (deliveryOption.priceCents > 0) {
                                  priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
                                }

                                return (
                                  <>
                                    <div
                                      className="delivery-option"
                                      key={deliveryOption.id}
                                    >
                                      <input
                                        type="radio"
                                        checked={
                                          deliveryOption.id ===
                                          cartItem.deliveryOptionId
                                        }
                                        className="delivery-option-input"
                                        name={`delivery-option-${cartItem.productId}`}
                                      />
                                      <div>
                                        <div className="delivery-option-date">
                                          {dayjs(
                                            deliveryOption.estimatedDeliveryTimeMs,
                                          ).format("dddd, MMMM, D")}
                                        </div>
                                        <div className="delivery-option-price">
                                          {priceString}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div class="payment-summary">
              <div class="payment-summary-title">Payment Summary</div>

              <div class="payment-summary-row">
                <div>Items ({paymentSummary.totalItems}):</div>
                <div class="payment-summary-money">
                  {formatMoney(paymentSummary.productCostCents)}
                </div>
              </div>

              <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">
                  {formatMoney(paymentSummary.shippingCostCents)}
                </div>
              </div>

              <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">
                  {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
                </div>
              </div>

              <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">
                  {formatMoney(paymentSummary.taxCents)}
                </div>
              </div>

              <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">
                  {formatMoney(paymentSummary.totalCostCents)}
                </div>
              </div>

              <button class="place-order-button button-primary">
                Place your order
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
