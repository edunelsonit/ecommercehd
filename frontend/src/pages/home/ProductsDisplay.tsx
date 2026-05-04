import { useEffect, useState } from 'react'
import api from "../../api/axios";
//import Product from './Product'


const ProductsDisplay = () => {
  //const [products, setProducts] = useState([{}]);
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await api.get('/api/products');
        console.log(productList);
        //setProducts(productList)
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

  if(!error){
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
        <>Products Will Be Listed Here</>
      </div>
    </div>
  )
};

export default ProductsDisplay;
