import { apiRequest } from '../../api/client'
import { StatusMessage } from '../../components/shared/StatusMessage'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { saveAuth, type AuthState } from '../../store/auth'

type VendorPageProps = {
  auth: AuthState | null
  onAuthChange: (auth: AuthState) => void
}

export function VendorPage({ auth, onAuthChange }: VendorPageProps) {
  const profileAction = useAsyncAction()
  const createAction = useAsyncAction()
  const stockAction = useAsyncAction()

  async function createVendorProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)

    await profileAction.run(async () => {
      const response = await apiRequest<AuthState>(
        '/auth/vendor-profile',
        auth.token,
        {
          method: 'POST',
          body: {
            businessName: String(form.get('businessName') || ''),
            vendorType: String(form.get('vendorType') || ''),
          },
        },
      )

      saveAuth(response)
      onAuthChange(response)
      formElement.reset()
      return 'Vendor profile created'
    })
  }

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const variantSize = String(form.get('variantSize') || '')
    const variantColor = String(form.get('variantColor') || '')
    const variantStock = Number(form.get('variantStock') || 0)
    const variantSku = String(form.get('variantSku') || '')

    await createAction.run(async () => {
      await apiRequest('/products/add', auth.token, {
        method: 'POST',
        body: {
          vendorId: String(form.get('vendorId') || ''),
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
          variants:
            variantSize || variantColor || variantStock || variantSku
              ? [
                  {
                    size: variantSize,
                    color: variantColor,
                    stockQuantity: variantStock,
                    sku: variantSku || undefined,
                  },
                ]
          : undefined,
        },
      })
      formElement.reset()
      return 'Product created'
    })
  }

  async function updateStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await stockAction.run(async () => {
      await apiRequest('/products/stock', auth.token, {
        method: 'PATCH',
        body: {
          variantId: String(form.get('variantId') || ''),
          quantity: Number(form.get('quantity')),
        },
      })
      formElement.reset()
      return 'Stock updated'
    })
  }

  return (
    <div className="dashboard-grid">
      {!auth?.user.vendorProfile && (
        <section className="panel wide-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Seller setup</p>
              <h2>Become a vendor</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={createVendorProfile}>
            <label>
              Business name
              <input name="businessName" required />
            </label>
            <label>
              Vendor type
              <input name="vendorType" placeholder="food, fashion, electronics" required />
            </label>
            <button className="primary-button span-2" type="submit" disabled={!auth || profileAction.loading}>
              Create vendor profile
            </button>
          </form>
          <StatusMessage error={profileAction.error} success={profileAction.success} />
        </section>
      )}

      <section className="panel wide-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h2>Add product</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={createProduct}>
          <label>
            Vendor ID
            <input name="vendorId" inputMode="numeric" placeholder="Optional for your own profile" />
          </label>
          <label>
            Product name
            <input name="name" required />
          </label>
          <label>
            Base price
            <input name="basePrice" type="number" min="1" required />
          </label>
          <label>
            Unit
            <input name="unitType" defaultValue="piece" required />
          </label>
          <label className="span-2">
            Description
            <textarea name="description" />
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
            Variant size
            <input name="variantSize" />
          </label>
          <label>
            Variant color
            <input name="variantColor" />
          </label>
          <label>
            Variant stock
            <input name="variantStock" type="number" min="0" />
          </label>
          <label>
            SKU
            <input name="variantSku" />
          </label>
          <button className="primary-button span-2" type="submit" disabled={!auth || createAction.loading}>
            Create product
          </button>
        </form>
        <StatusMessage error={createAction.error} success={createAction.success} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Update stock</h2>
          </div>
        </div>
        <form className="form-grid single" onSubmit={updateStock}>
          <label>
            Variant ID
            <input name="variantId" inputMode="numeric" required />
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="0" required />
          </label>
          <button className="primary-button" type="submit" disabled={!auth || stockAction.loading}>
            Save stock
          </button>
        </form>
        <StatusMessage error={stockAction.error} success={stockAction.success} />
      </section>
    </div>
  )
}
