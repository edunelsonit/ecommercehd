import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'
import { compactId, formatMoney } from '../utils/format'

export type OrderItem = {
  id: string
  quantity: number
  priceAtPurchase: string
  product: {
    id: string
    name: string
    description?: string | null
  }
  variant?: {
    id: string
    size?: string | null
    color?: string | null
  } | null
}

export type Order = {
  id: string
  totalAmount: string
  paymentStatus: string
  orderStatus: string
  landmarkAddress?: string | null
  createdAt: string
  items: OrderItem[]
  delivery?: {
    id: string
    status: string
    riderId: string
    deliveredAt?: string | null
  } | null
}

type OrdersPageProps = {
  auth: AuthState | null
  onTrackOrder: (order: Order) => void
}

export function OrdersPage({ auth, onTrackOrder }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const action = useAsyncAction()
  const run = action.run

  const loadOrders = useCallback(async () => {
    if (!auth) return

    await run(async () => {
      const data = await apiRequest<Order[]>('/orders', auth.token)
      setOrders(data)
      return ''
    })
  }, [auth, run])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  if (!auth) {
    return (
      <section className="panel">
        <p className="eyebrow">Orders</p>
        <h2>Login required</h2>
      </section>
    )
  }

  return (
    <section className="panel wide-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">History</p>
          <h2>Your orders</h2>
        </div>
        <button type="button" className="secondary-button" onClick={() => void loadOrders()}>
          Refresh
        </button>
      </div>

      <StatusMessage error={action.error} success={action.success} />

      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <strong>Order {compactId(order.id)}</strong>
                <small>{new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="order-total">{formatMoney(order.totalAmount)}</div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <span>{item.product.name}</span>
                  <small>
                    Qty {item.quantity}
                    {item.variant ? ` · ${item.variant.size || ''} ${item.variant.color || ''}` : ''}
                  </small>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span className={`status-chip ${order.orderStatus}`}>{order.orderStatus}</span>
              <button type="button" className="secondary-button" onClick={() => onTrackOrder(order)}>
                Track package
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
