import { apiRequest } from '../api/client'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'

type ProcurementPageProps = {
  auth: AuthState | null
}

export function ProcurementPage({ auth }: ProcurementPageProps) {
  const action = useAsyncAction()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await action.run(async () => {
      await apiRequest('/procurement/request', auth.token, {
        method: 'POST',
        body: {
          productUrl: String(form.get('productUrl') || ''),
          estimatedCost: Number(form.get('estimatedCost')),
        },
      })
      formElement.reset()
      return 'Procurement request submitted'
    })
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">External sourcing</p>
          <h2>Request procurement</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <label className="span-2">
          Product URL
          <input name="productUrl" type="url" required />
        </label>
        <label>
          Estimated foreign cost
          <input name="estimatedCost" type="number" min="1" required />
        </label>
        <button className="primary-button" type="submit" disabled={!auth || action.loading}>
          Submit
        </button>
      </form>
      <StatusMessage error={action.error} success={action.success} />
    </section>
  )
}
