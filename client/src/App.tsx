import { useEffect, useState } from 'react'
import './App.css'
import { ApiStatus } from './components/ApiStatus'
import { ProductPreview } from './components/ProductPreview'
import { api, type Product } from './lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('Waiting to test the backend.')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function testBackend() {
      try {
        setStatus('loading')
        setMessage('Calling /api/health and /api/products...')

        const [healthResult, productsResult] = await Promise.all([
          api.health(),
          api.products(),
        ])

        setProducts(productsResult.data ?? [])
        setMessage(healthResult.message ?? 'Backend is reachable.')
        setStatus('success')
      } catch (error) {
        setProducts([])
        setMessage(error instanceof Error ? error.message : 'Cannot connect to API.')
        setStatus('error')
      }
    }

    testBackend()
  }, [])

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">ShopLink frontend</p>
        <h1>Start with backend data first</h1>
        <p>
          This screen only tests connection and renders simple data. Build the
          real UI after the data shape is clear.
        </p>
      </header>

      <div className="panel-grid">
        <ApiStatus apiUrl={api.baseUrl} status={status} message={message} />
        <ProductPreview products={products} />
      </div>
    </main>
  )
}

export default App
