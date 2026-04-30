import { Header } from "../components/Header";
import "./css/OrdersPage.css";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { formatMoney } from "../utils/money";
import { Link } from "react-router";

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);
  /*
  useEffect(() => {
    axios.get("/api/orders?expand=products").then((response) => {
      setOrders(response.data);
    });
  }, []);
*/

  useEffect(() => {
    
    const fetchOrdersData = async () => {
      let response = await axios.get("/api/orders?expand=products");
      setOrders(response.data);
    };
    fetchOrdersData();
  },
  []);

  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>
        <div className="orders-grid">
          {orders.map((order) => {

            console.log(dayjs(order.createdAt).format("dddd, MMMM, D, YYYY"));
            
            return (
              <>
                <div className="order-container" key={order.id}>
                  <div className="order-header">
                    <div className="order-header-left-section">
                      <div className="order-date">
                        <div className="order-header-label">Order Placed:</div>
                        <div>
                          {dayjs(order.createdAt).format("dddd, MMMM, D, YYYY")}
                        </div>
                      </div>
                      <div className="order-total">
                        <div className="order-header-label">Total:</div>
                        <div>{formatMoney(order.totalCostCents)}</div>
                      </div>
                    </div>

                    <div className="order-header-right-section">
                      <div className="order-header-label">Order ID:</div>
                      <div>{order.id}</div>
                    </div>
                  </div>

                  <div className="order-details-grid">
                    {order.products.map((orderProduct) => {

                      return (
                        <Fragment key={orderProduct.productId}>
                          <div className="product-image-container">
                            <img src={orderProduct.product.image} />
                          </div>

                          <div className="product-details">
                            <div className="product-name">
                              {orderProduct.product.name}
                            </div>
                            <div className="product-delivery-date">
                              {dayjs(
                                orderProduct.estimatedDeliveryTimeMs,
                              ).format("dddd,MMMM, D, YYYY")}
                            </div>
                            <div className="product-quantity">
                              Quantity: {orderProduct.quantity}
                            </div>
                            <button className="buy-again-button button-primary">
                              <img
                                className="buy-again-icon"
                                src="images/icons/buy-again.png"
                              />
                              <span className="buy-again-message">
                                Add to Cart
                              </span>
                            </button>
                          </div>

                          <div className="product-actions">
                            <Link to="/tracking">
                              <button
                                className="track-package-button button-secondary"
                                >
                                Track package
                              </button>
                            </Link>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}