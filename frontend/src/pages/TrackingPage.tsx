import type { Order } from './OrdersPage'

type TrackingPageProps = {
  order: Order | null
  onOpenOrders: () => void
}

const stages = ['pending', 'processing', 'shipped', 'delivered']

export function TrackingPage({ order, onOpenOrders }: TrackingPageProps) {
  const currentStatus = order?.orderStatus || 'pending'
  const currentIndex = Math.max(0, stages.indexOf(currentStatus))
  const progress = order?.orderStatus === 'cancelled' ? 0 : (currentIndex / (stages.length - 1)) * 100

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Delivery</p>
          <h2>Order tracking</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onOpenOrders}>
          View orders
        </button>
      </div>

      {!order ? (
        <div className="empty-state">Select an order to track.</div>
      ) : (
        <div className="tracking-detail">
          <div>
            <strong>Order #{order.id}</strong>
            <p>{order.landmarkAddress || 'No landmark provided'}</p>
          </div>

          <div className="tracking-products">
            {order.items.map((item) => (
              <div className="order-item" key={item.id}>
                <span>{item.product.name}</span>
                <small>Quantity: {item.quantity}</small>
              </div>
            ))}
          </div>

          <div className="progress-labels">
            {stages.map((stage, index) => (
              <span key={stage} className={index <= currentIndex ? 'active' : ''}>
                {stage}
              </span>
            ))}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="tracking-meta">
            <span>Payment: {order.paymentStatus}</span>
            <span>Delivery: {order.delivery?.status || 'not assigned'}</span>
          </div>
        </div>
      )}
    </section>
  )
}
