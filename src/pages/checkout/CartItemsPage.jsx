import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./DeliveryOptions";
import axios from "axios";

export function CartItemsPage({
  cartItem,
  selectedDeliveryOption,
  deliveryOptions,
  loadCart,
}) {
  const updateCartItem = async ()=>{
    //
  };


  const deleteCartItem = async () => {
    
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };
  return (
    <div className="cart-item-container" key={cartItem.product.id}>
      <div className="delivery-date">
        Delivery date:{" "}
        {dayjs(selectedDeliveryOption.deliveryDate).format("dddd, MMMM, D")}
      </div>

      <div className="cart-item-details-grid">
        <img className="product-image" src={cartItem.product.image} />

        <div className="cart-item-details">
          <div className="product-name">{cartItem.product.name}</div>
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
            <span
              className="update-quantity-link link-primary"
              onClick={updateCartItem}
            >
              Update
            </span>
            <span
              className="delete-quantity-link link-primary"
              onClick={deleteCartItem}
            >
              Delete
            </span>
          </div>
        </div>

        <DeliveryOptions
          deliveryOptions={deliveryOptions}
          cartItem={cartItem}
          loadCart={loadCart}
        />
      </div>
    </div>
  );
}
