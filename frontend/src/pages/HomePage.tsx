import ProductsDisplay from "./home/ProductsDisplay"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Hero from "./home/HeroPart"

const HomePage = () => {
  return (
    <>
        <Header/>
        <div>
            <Hero/>
            <ProductsDisplay/>
        </div>
        <Footer/>
    </>
    
  )
}

export default HomePage