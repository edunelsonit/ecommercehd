import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import axios from "axios";

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart}) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "Free Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          axios.put(`/api/cart-items/${cartItem.productId}`, {
            deliveryOptionId: deliveryOption.id,
          });

          await loadCart();
        };

        return (
          <>
            <div
              className="delivery-option"
              key={deliveryOption.id}
              onClick={updateDeliveryOption}
            >
              <input
                type="radio"
                checked={deliveryOption.id === cartItem.deliveryOptionId}
                onChange={()=>{}}
                className="delivery-option-input"
                name={`delivery-option-${cartItem.productId}`}
              />
              <div>
                <div className="delivery-option-date">
                  {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                    "dddd, MMMM, D",
                  )}
                </div>
                <div className="delivery-option-price">{priceString}</div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
