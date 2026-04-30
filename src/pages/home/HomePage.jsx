import "../css/HomePage.css";
import { Header } from "../../components/Header";
import axios from "axios";
import { useEffect, useState} from "react";
import { ProductGrid } from "./ProductGrid";

export function HomePage({cart, loadCart}) {

  const [products, setProducts] = useState([]);


  useEffect(()=>{

    const fetchHomeData = async () =>{
      let response = await axios.get('/api/products');

        setProducts(response.data);
    };
        fetchHomeData()
      
    },[]);
  

  return (
    <>
      <title>Nelsonict Shop</title>
      <Header cart={cart}/>

      <div className="home-page">
          <ProductGrid products={products} loadCart={loadCart}/>
      </div>
    </>
  );
}
