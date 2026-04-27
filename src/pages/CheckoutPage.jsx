import { formatMoney } from "../utils/money";
import "./css/Checkout.css";
import { Link } from "react-router";

import axios from "axios";

import "./css/checkout-header.css";
import { useState, useEffect } from "react";

export function CheckoutPage({ cart }) {

   let totalQuantity = 0;
    cart.forEach(cartItem => {
        totalQuantity += cartItem.quantity
    });

  const [deliveryOptions, setDeliveryOptions] = useState([]);

    useEffect(() => {
      axios
        .get("/api/delivery-options?expand=estimatedDeliveryTime")
        .then((response) => {
          console.log(response.data);
          setDeliveryOptions(response.data);
        });
    },[]);

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

            <div className="checkout-page">
              <div className="page-title">Review your order</div>

              <div className="checkout-grid">
                <div className="order-summary">
                  {cart.map((cartItem) => {

                    const selectedDeliveryOption = deliveryOptions.find((deliveryOption)=>{

                      return deliveryOption.id === cartItem.deliveryOptionId;
                    })
                    
                    return (
                      <>
                        <div
                          className="cart-item-container"
                          key={cartItem.product.id}
                        >
                          <div className="delivery-date">
                            Delivery date: {selectedDeliveryOption.deliveryDate}
                            
                            Tuesday, June 21
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
                                return (
                                  <>
                                    <div
                                      className="delivery-option"
                                      key={deliveryOption.id}
                                    >
                                      <input
                                        type="radio"
                                        checked={deliveryOption.id ===cartItem.deliveryOptionId}
                                        className="delivery-option-input"
                                        name={`delivery-option-${cartItem.productId}`}
                                      />
                                      <div>
                                        <div className="delivery-option-date">
                                          {deliveryOption.estimatedDeliveryTimeMs}
                                        </div>
                                        <div className="delivery-option-price">$
                                          {formatMoney(deliveryOption.priceCents)} - Shipping
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
            </div>
          </>
  );
}
