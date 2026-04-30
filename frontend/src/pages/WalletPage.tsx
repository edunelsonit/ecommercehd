import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'
import { compactId, formatMoney } from '../utils/format'

type WalletTransaction = {
  id: string
  amount: string
  transactionType: string
  status: string
  reference?: string | null
  createdAt: string
}

type Wallet = {
  id: string
  balance: string
  currency: string
  transactions: WalletTransaction[]
}

type WalletPageProps = {
  auth: AuthState | null
}

export function WalletPage({ auth }: WalletPageProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const loadAction = useAsyncAction()
  const fundAction = useAsyncAction()
  const runLoad = loadAction.run

  const loadWallet = useCallback(async () => {
    if (!auth) return

    await runLoad(async () => {
      const data = await apiRequest<Wallet>('/wallet/balance', auth.token)
      setWallet(data)
      return ''
    })
  }, [auth, runLoad])

  useEffect(() => {
    void loadWallet()
  }, [loadWallet])

  async function fundWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await fundAction.run(async () => {
      await apiRequest('/wallet/fund', auth.token, {
        method: 'POST',
        body: {
          amount: Number(form.get('amount')),
          reference: String(form.get('reference') || `manual-${Date.now()}`),
        },
      })
      formElement.reset()
      await loadWallet()
      return 'Wallet funded'
    })
  }

  if (!auth) {
    return <LoginRequired />
  }

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <p className="eyebrow">Balance</p>
        <div className="metric-large">{formatMoney(wallet?.balance)}</div>
        <button type="button" className="secondary-button" onClick={() => void loadWallet()}>
          Refresh
        </button>
        <StatusMessage error={loadAction.error} success={loadAction.success} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Funding</p>
            <h2>Add funds</h2>
          </div>
        </div>
        <form className="form-grid single" onSubmit={fundWallet}>
          <label>
            Amount
            <input name="amount" type="number" min="1" required />
          </label>
          <label>
            Reference
            <input name="reference" placeholder="Paystack reference" />
          </label>
          <button type="submit" className="primary-button" disabled={fundAction.loading}>
            Fund wallet
          </button>
        </form>
        <StatusMessage error={fundAction.error} success={fundAction.success} />
      </section>

      <section className="panel wide-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">History</p>
            <h2>Recent transactions</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(wallet?.transactions || []).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{compactId(transaction.reference || transaction.id)}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.status}</td>
                  <td>{formatMoney(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function LoginRequired() {
  return (
    <section className="panel">
      <p className="eyebrow">Authentication</p>
      <h2>Login required</h2>
    </section>
  )
}
