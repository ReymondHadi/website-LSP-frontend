import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop'
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import TransactionHistory from './Components/TransactionHistory/TransactionHistory';
import About from './Components/About/About';
import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/data`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/drinks' element={<ShopCategory category="minuman"/>}/>
        <Route path='/foods' element={<ShopCategory category="makanan"/>}/>
        <Route path='/appetizers' element={<ShopCategory category="appetizer"/>}/>
        <Route path="product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/transaction-history' element={<TransactionHistory/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
