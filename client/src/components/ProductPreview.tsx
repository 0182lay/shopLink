import type { Product } from '../lib/api'

type ProductPreviewProps = {
  products: Product[]
}

export function ProductPreview({ products }: ProductPreviewProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Step 2</p>
          <h2>Products test</h2>
        </div>
        <span className="count-badge">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <p className="muted">No products yet, or the backend returned an empty list.</p>
      ) : (
        <div className="product-list">
          {products.slice(0, 6).map((product) => (
            <article className="product-row" key={product.id}>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description ?? 'No description'}</p>
              </div>
              <strong>{Number(product.price).toLocaleString('th-TH')} THB</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
