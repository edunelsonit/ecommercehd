import { useCallback, useState } from 'react'

type AsyncActionState = {
  loading: boolean
  error: string
  success: string
}

export function useAsyncAction() {
  const [state, setState] = useState<AsyncActionState>({
    loading: false,
    error: '',
    success: '',
  })

  const run = useCallback(async (action: () => Promise<string | void>) => {
    setState({ loading: true, error: '', success: '' })

    try {
      const success = await action()
      setState({ loading: false, error: '', success: success || 'Saved' })
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Action failed'

      setState({ loading: false, error: message, success: '' })
    }
  }, [])

  return { ...state, run }
}
