import { useEffect, useState } from 'react'
import api from "../../api/axios";
import { Product } from './Product'


const ProductsDisplay = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await api.get('/api/products');
        setProducts(productList)
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

  if(!products[0]){
    return(
      <>
      <h1>No Products available in the Market Yet</h1>
      </>
    )
  }
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
};

export default ProductsDisplay;
