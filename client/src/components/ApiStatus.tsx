type ApiStatusProps = {
  apiUrl: string
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export function ApiStatus({ apiUrl, status, message }: ApiStatusProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 1</p>
          <h2>Backend connection</h2>
        </div>
        <span className={`status-badge ${status}`}>{status}</span>
      </div>

      <div className="info-list">
        <div>
          <span>API URL</span>
          <code>{apiUrl}</code>
        </div>
        <div>
          <span>Health check</span>
          <p>{message}</p>
        </div>
      </div>
    </section>
  )
}
