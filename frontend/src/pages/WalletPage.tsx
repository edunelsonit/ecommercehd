import { useCallback, useEffect, useState } from 'react'
import axios from '../api/axios'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState } from '../store/auth'
import { compactId, formatMoney } from '../utils/format'
import AddFundModal from '../components/modals/AddFundModal'
import Header from '../components/Header'

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
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = () => {
    // Debug: ensure clicks reach this handler
    console.log('WalletPage: openModal called')
    setModalOpen(true)
  }
  const loadAction = useAsyncAction()
  const fundAction = useAsyncAction()
  const runLoad = loadAction.run

  const loadWallet = useCallback(async () => {
    if (!auth) return

    await runLoad(async () => {
      const data = await axios.get('/wallet/balance', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      setWallet(data.data)
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
      await axios.post('/wallet/fund', {
        amount: Number(form.get('amount')),
        reference: String(form.get('reference') || `manual-${Date.now()}`),
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
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
        <div className="flex gap-3">
          <button type="button" className="secondary-button" onClick={() => void loadWallet()}>
            Refresh
          </button>
          <button type="button" className="primary-button" onClick={openModal}>
            Add funds
          </button>
        </div>
        <StatusMessage error={loadAction.error} success={loadAction.success} />
      </section>

      <AddFundModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onFund={async (amount: number, reference?: string) => {
          if (!auth) throw new Error('Not authenticated')
          await fundAction.run(async () => {
            await axios.post('/wallet/fund', { amount, reference: reference || `manual-${Date.now()}` }, {
              headers: { Authorization: `Bearer ${auth.token}` }
            })
            await loadWallet()
            return ''
          })
        }}
      />

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
    <>
    <Header/>
    <section className="panel">
      <p className="eyebrow">Authentication</p>
      <h2>Login required</h2>
    </section>
    
    </>
    
  )
}
