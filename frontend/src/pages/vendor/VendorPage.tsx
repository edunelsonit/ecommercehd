import { apiRequest } from '../../api/client'
import { StatusMessage } from '../../components/shared/StatusMessage'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import type { AuthState } from '../../store/auth'

type VendorPageProps = {
  auth: AuthState | null
}

export function VendorPage({ auth }: VendorPageProps) {
  const createAction = useAsyncAction()
  const stockAction = useAsyncAction()

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
            <input name="vendorId" inputMode="numeric" required />
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
