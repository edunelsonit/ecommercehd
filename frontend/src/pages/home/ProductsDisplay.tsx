import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/client'
import Product, { type HomeProduct } from './Product'


const ProductsDisplay = () => {
  const [products, setProducts] = useState<HomeProduct[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest<HomeProduct[]>('/products?city=Gembu')
        setProducts(data)
      } catch (requestError) {
        const message =
          requestError && typeof requestError === 'object' && 'message' in requestError
            ? String(requestError.message)
            : 'Unable to load products'
        setError(message)
      }
    }

    void loadProducts()
  }, [])

  return (
    <div className="home-products">
      {error && <div className="status status-error">{error}</div>}
      <div className="product-grid">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductsDisplay
