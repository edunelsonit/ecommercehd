import { useState } from 'react'
import axios from '../api/axios'
import { StatusMessage } from '../components/shared/StatusMessage'
import { useAsyncAction } from '../hooks/useAsyncAction'
import type { AuthState, Role } from '../store/auth'

type AuthPanelProps = {
  onAuthenticated: (auth: AuthState) => void
}

export function AuthPanel({ onAuthenticated }: AuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const action = useAsyncAction()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    await action.run(async () => {
      if (mode === 'register') {
        await axios.post('/auth/register', {
          surname: String(form.get('surname') || ''),
          first_name: String(form.get('first_name') || ''),
          phone: String(form.get('phone') || ''),
          nin: String(form.get('nin') || ''),
          address: String(form.get('address') || ''),
          lga_region: String(form.get('lga_region') || ''),
          city: String(form.get('city') || ''),
          password: String(form.get('password') || ''),
          role: String(form.get('role') || 'customer') as Role,
        })
      }

      const loginRes = await axios.post('/auth/login', {
        phone: String(form.get('phone') || ''),
        password: String(form.get('password') || ''),
      })

      // Pass the auth payload (response data) to the parent
      onAuthenticated(loginRes.data ?? loginRes)
      return mode === 'register' ? 'Account created' : 'Logged in'
    })
  }

  return (
    <section className="auth-panel">
      <div>
        <p className="eyebrow">Secure access</p>
        <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      </div>

      <div className="segmented">
        <button
          type="button"
          className={mode === 'login' ? 'selected' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'selected' : ''}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label>
              Surname
              <input name="surname" required />
            </label>
            <label>
              First name
              <input name="first_name" required />
            </label>
            <label>
              NIN
              <input name="nin" inputMode="numeric" minLength={11} maxLength={11} required />
            </label>
            <label>
              Role
              <select name="role" defaultValue="customer">
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="rider">Rider</option>
                <option value="organization">Organization</option>
              </select>
            </label>
            <label>
              LGA / Region
              <input name="lga_region" required />
            </label>
            <label>
              City
              <input name="city" defaultValue="Gembu" required />
            </label>
            <label className="span-2">
              Address
              <input name="address" required />
            </label>
          </>
        )}

        <label>
          Phone
          <input name="phone" inputMode="tel" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={6} required />
        </label>

        <button className="primary-button span-2" type="submit" disabled={action.loading}>
          {action.loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register and login'}
        </button>
      </form>

      <StatusMessage error={action.error} success={action.success} />
    </section>
  )
}
