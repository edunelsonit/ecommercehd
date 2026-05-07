import axios from '../api/axios'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'

type SupportPageProps = {
  auth: AuthState | null
}

export function SupportPage({ auth }: SupportPageProps) {
  const action = useAsyncAction()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await action.run(async () => {
      await axios.post('/support/disputes', {
        orderId: String(form.get('orderId') || ''),
        reason: String(form.get('reason') || ''),
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      formElement.reset()
      return 'Dispute filed'
    })
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Resolution</p>
          <h2>File dispute</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <label>
          Order ID
          <input name="orderId" inputMode="numeric" required />
        </label>
        <label className="span-2">
          Reason
          <textarea name="reason" required />
        </label>
        <button className="primary-button" type="submit" disabled={!auth || action.loading}>
          File dispute
        </button>
      </form>
      <StatusMessage error={action.error} success={action.success} />
    </section>
  )
}
