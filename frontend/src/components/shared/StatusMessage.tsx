type StatusMessageProps = {
  error?: string
  success?: string
}

export function StatusMessage({ error, success }: StatusMessageProps) {
  if (!error && !success) return null

  return (
    <div className={error ? 'status status-error' : 'status status-success'} role="status">
      {error || success}
    </div>
  )
}
