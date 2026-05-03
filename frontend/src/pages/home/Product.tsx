import { useEffect, useState } from "react"

interface ProductProps {
  image: string;
  name: string;
  description: string;
  price: number | string;
}

const Product = ({ image, name, description, price }: ProductProps) => {
  const initialQuantity = 1;
  const [count, setCount] = useState(initialQuantity);


  const reduceQuantity = ()=>{

      if(count > 1){
        setCount(count - 1)
      }
      else{
        setCount(1)
      }
      };
const addQuantity = ()=>{
        setCount(count + 1)

      };
  

  

  return (
    <div>
      <img src={image}/>
      <h3>{name}</h3>
      <p>{description}</p>
      <h2>{price}</h2>
      <div>
        <button onClick={reduceQuantity}>-</button>
        <h1>{count}</h1>
        <button onClick={addQuantity}>+</button>
      </div>
    </div>
  )
};

export default Product;