import { apiRequest } from '../../api/client'
import { StatusMessage } from '../../components/shared/StatusMessage'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import type { AuthState } from '../../store/auth'

type AdminPageProps = {
  auth: AuthState | null
}

export function AdminPage({ auth }: AdminPageProps) {
  const assignAction = useAsyncAction()
  const verifyAction = useAsyncAction()
  const temporaryProductAction = useAsyncAction()

  async function assignRider(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await assignAction.run(async () => {
      await apiRequest('/logistics/assign-rider', auth.token, {
        method: 'POST',
        body: {
          orderId: String(form.get('orderId') || ''),
          riderId: String(form.get('riderId') || ''),
          calculatedFee: Number(form.get('calculatedFee')),
        },
      })
      formElement.reset()
      return 'Rider assigned'
    })
  }

  async function verifyDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await verifyAction.run(async () => {
      await apiRequest('/orders/verify-delivery', auth.token, {
        method: 'POST',
        body: {
          orderId: String(form.get('verifyOrderId') || ''),
          otp: String(form.get('otp') || ''),
        },
      })
      formElement.reset()
      return 'Delivery verified'
    })
  }

  async function createTemporaryProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await temporaryProductAction.run(async () => {
      await apiRequest('/products/temporary', auth.token, {
        method: 'POST',
        body: {
          name: String(form.get('name') || ''),
          description: String(form.get('description') || ''),
          image: String(form.get('image') || ''),
          rating: {
            stars: Number(form.get('ratingStars') || 0),
            count: Number(form.get('ratingCount') || 0),
          },
          keywords: String(form.get('keywords') || '')
            .split(',')
            .map((keyword) => keyword.trim())
            .filter(Boolean),
          basePrice: Number(form.get('basePrice')),
          unitType: String(form.get('unitType') || 'piece'),
          stockQuantity: Number(form.get('stockQuantity') || 10),
          size: String(form.get('size') || ''),
          color: String(form.get('color') || ''),
          sku: String(form.get('sku') || ''),
        },
      })
      formElement.reset()
      return 'Temporary product created'
    })
  }

  return (
    <div className="dashboard-grid">
      <section className="panel wide-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Testing</p>
            <h2>Create temporary product</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={createTemporaryProduct}>
          <label>
            Product name
            <input name="name" placeholder="Test rice bag" required />
          </label>
          <label>
            Base price
            <input name="basePrice" type="number" min="1" placeholder="15000" required />
          </label>
          <label>
            Unit
            <input name="unitType" defaultValue="piece" required />
          </label>
          <label className="span-2">
            Image URL
            <input name="image" placeholder="https://example.com/product.jpg" />
          </label>
          <label>
            Rating stars
            <input name="ratingStars" type="number" min="0" max="5" defaultValue="4" />
          </label>
          <label>
            Rating count
            <input name="ratingCount" type="number" min="0" defaultValue="127" />
          </label>
          <label className="span-2">
            Keywords
            <input name="keywords" placeholder="sports, basketballs" />
          </label>
          <label>
            Stock quantity
            <input name="stockQuantity" type="number" min="0" defaultValue="10" required />
          </label>
          <label>
            Size
            <input name="size" placeholder="50kg" />
          </label>
          <label>
            Color
            <input name="color" placeholder="Optional" />
          </label>
          <label className="span-2">
            SKU
            <input name="sku" placeholder="Leave blank to auto-generate" />
          </label>
          <label className="span-2">
            Description
            <textarea name="description" placeholder="Temporary test product for checkout testing" />
          </label>
          <button
            className="primary-button span-2"
            type="submit"
            disabled={!auth || temporaryProductAction.loading}
          >
            Create test product
          </button>
        </form>
        <StatusMessage
          error={temporaryProductAction.error}
          success={temporaryProductAction.success}
        />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Dispatch</p>
            <h2>Assign rider</h2>
          </div>
        </div>
        <form className="form-grid single" onSubmit={assignRider}>
          <label>
            Order ID
            <input name="orderId" inputMode="numeric" required />
          </label>
          <label>
            Rider ID
            <input name="riderId" inputMode="numeric" required />
          </label>
          <label>
            Delivery fee
            <input name="calculatedFee" type="number" min="1" required />
          </label>
          <button className="primary-button" type="submit" disabled={!auth || assignAction.loading}>
            Assign
          </button>
        </form>
        <StatusMessage error={assignAction.error} success={assignAction.success} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Proof of delivery</p>
            <h2>Verify OTP</h2>
          </div>
        </div>
        <form className="form-grid single" onSubmit={verifyDelivery}>
          <label>
            Order ID
            <input name="verifyOrderId" inputMode="numeric" required />
          </label>
          <label>
            OTP
            <input name="otp" inputMode="numeric" minLength={6} maxLength={6} required />
          </label>
          <button className="primary-button" type="submit" disabled={!auth || verifyAction.loading}>
            Verify
          </button>
        </form>
        <StatusMessage error={verifyAction.error} success={verifyAction.success} />
      </section>

      <section className="panel wide-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Monitoring</p>
            <h2>Rider tracking</h2>
          </div>
        </div>
        <div className="tracking-board">
          <div className="tracking-node active">Assigned</div>
          <div className="tracking-line" />
          <div className="tracking-node">Picked up</div>
          <div className="tracking-line" />
          <div className="tracking-node">Delivered</div>
        </div>
      </section>
    </div>
  )
}
