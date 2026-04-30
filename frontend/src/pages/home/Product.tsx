import { formatMoney } from '../../utils/format'

export type HomeProduct = {
  id: string
  name: string
  description?: string | null
  image?: string | null
  basePrice: string
  unitType: string
  rating?: {
    stars: number
    count: number
  }
  keywords?: string[]
}

type ProductProps = {
  product: HomeProduct
}

const Product = ({ product }: ProductProps) => {
  return (
    <article className="product-card">
      <div className="product-image-shell">
        <img src={product.image || '/favicon.svg'} alt={product.name} className="product-image" />
      </div>
      <h3>{product.name}</h3>
      <p>{product.description || 'Available now'}</p>
      <div className="rating-row">
        <span>{'★'.repeat(Math.round(product.rating?.stars || 0)).padEnd(5, '☆')}</span>
        <small>{product.rating?.count || 0}</small>
      </div>
      <div className="keyword-row">
        {(product.keywords || []).slice(0, 3).map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
      <strong>{formatMoney(product.basePrice)}</strong>
      <small>{product.unitType}</small>
    </article>
  )
}

export default Product
