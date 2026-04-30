import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'
import { formatMoney } from '../utils/format'

export type ProductVariant = {
  id: string
  size?: string | null
  color?: string | null
  priceOverride?: string | null
  stockQuantity: number
}

export type Product = {
  id: string
  name: string
  description?: string | null
  basePrice: string
  unitType: string
  variants: ProductVariant[]
  vendor?: {
    businessName: string
    city?: string | null
  }
}

export type CartItem = {
  product: Product
  variant?: ProductVariant
  quantity: number
}

type MarketPageProps = {
  auth: AuthState | null
}

export function MarketPage({ auth }: MarketPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [city, setCity] = useState('Gembu')
  const [landmarkAddress, setLandmarkAddress] = useState('')
  const loadAction = useAsyncAction()
  const checkoutAction = useAsyncAction()
  const runLoad = loadAction.run

  const loadProducts = useCallback(async () => {
    await runLoad(async () => {
      const query = new URLSearchParams()
      if (city) query.set('city', city)
      const data = await apiRequest<Product[]>(`/products?${query}`)
      setProducts(data)
      return ''
    })
  }, [city, runLoad])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  function addToCart(product: Product, variant?: ProductVariant) {
    setCart((items) => {
      const key = `${product.id}:${variant?.id || 'base'}`
      const existing = items.find((item) => `${item.product.id}:${item.variant?.id || 'base'}` === key)

      if (existing) {
        return items.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...items, { product, variant, quantity: 1 }]
    })
  }

  const total = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const price = Number(item.variant?.priceOverride || item.product.basePrice)
        return sum + price * item.quantity
      }, 0),
    [cart],
  )

  async function checkout() {
    if (!auth) return

    await checkoutAction.run(async () => {
      await apiRequest('/orders/checkout', auth.token, {
        method: 'POST',
        body: {
          totalAmount: total,
          landmarkAddress,
          items: cart.map((item) => ({
            productId: item.product.id,
            variantId: item.variant?.id,
            quantity: item.quantity,
            price: Number(item.variant?.priceOverride || item.product.basePrice),
          })),
        },
      })

      setCart([])
      setLandmarkAddress('')
      return 'Order placed'
    })
  }

  return (
    <div className="dashboard-grid">
      <section className="panel wide-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Products</p>
            <h2>Local marketplace</h2>
          </div>
          <form
            className="inline-form"
            onSubmit={(event) => {
              event.preventDefault()
              void loadProducts()
            }}
          >
            <input value={city} onChange={(event) => setCity(event.target.value)} />
            <button type="submit" className="secondary-button">
              Filter
            </button>
          </form>
        </div>

        <StatusMessage error={loadAction.error} success={loadAction.success} />

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description || product.vendor?.businessName || 'Available now'}</p>
              </div>
              <strong>{formatMoney(product.basePrice)}</strong>
              <small>{product.unitType}</small>
              <div className="variant-list">
                {(product.variants.length ? product.variants : [undefined]).map((variant) => (
                  <button
                    key={variant?.id || product.id}
                    type="button"
                    className="secondary-button"
                    onClick={() => addToCart(product, variant)}
                  >
                    {variant ? `${variant.size || 'Size'} ${variant.color || ''}` : 'Add'}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Checkout</p>
            <h2>Cart</h2>
          </div>
          <strong>{formatMoney(total)}</strong>
        </div>

        <div className="cart-list">
          {cart.map((item) => (
            <div className="cart-row" key={`${item.product.id}:${item.variant?.id || 'base'}`}>
              <span>{item.product.name}</span>
              <small>Qty {item.quantity}</small>
            </div>
          ))}
        </div>

        <label>
          Landmark address
          <textarea
            value={landmarkAddress}
            onChange={(event) => setLandmarkAddress(event.target.value)}
          />
        </label>

        <button
          type="button"
          className="primary-button"
          disabled={!auth || cart.length === 0 || checkoutAction.loading}
          onClick={() => void checkout()}
        >
          Place order
        </button>
        <StatusMessage error={checkoutAction.error} success={checkoutAction.success} />
      </section>
    </div>
  )
}
