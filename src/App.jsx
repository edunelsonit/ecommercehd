import './App.css'
import {Routes, Route  } from "react-router";
import {HomePage} from './pages/home/HomePage'
import {CheckoutPage} from './pages/checkout/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { TrackingPage } from './pages/TrackingPage';
import { useEffect, useState } from 'react';
import axios from 'axios';



function App() {
  const [cart, setCart] = useState([]);
  
  const loadCart = async ()=>{

      let response = await axios.get('/api/cart-items?expand=product');

      setCart(response.data);
      };

    useEffect(()=>{
      
      loadCart();
      
    },
    []);

  

    return(
      <Routes>
        <Route index element={<HomePage cart={cart} loadCart={loadCart}/>}/>
        <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart}/>}/>
        <Route path="orders" element={<OrdersPage cart={cart} />}/>
        <Route path="tracking" element={<TrackingPage cart={cart}/>}/>

      </Routes>
    )
}

export default App
