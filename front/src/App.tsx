import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import View from './components/View';
import Search from './components/Search';
import Admin from './components/Admin';
import MyPage from './components/MyPage';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import Login from './components/Login';
import { Product } from './interfaces/product';
import { SelectOption } from './interfaces/selectOption';
import './App.css';

const quantityOptions: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString()
}));

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartVisible, setCartVisible] = useState<boolean>(false);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleEmptyCart = () => {
    setCartItems([]);
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleIncreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleQuantityChange = (id: number, selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: parseInt(selectedOption.value) } : item
        )
      );
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const toggleCartVisibility = () => {
    setCartVisible(!cartVisible);
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/view">Products</Link></li>
              {/* <li><Link to="/search">Search</Link></li> */}
              <li><Link to="/mypage">My Page</Link></li>
              {/* <li><Link to="/Admin">Admin</Link></li> */}
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </header>

        <div className="content">
          <div className="main-content">
            <Routes>
              <Route path="/view" element={<View addToCart={addToCart} />} />
              {/* <Route path="/search" element={<Search />} /> */}
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/checkout"
                element={<Checkout items={cartItems} totalPrice={totalPrice} />}
              />
            </Routes>
          </div>
          {cartVisible && (
            <div className="cart-content">
              <Cart
                items={cartItems}
                quantityOptions={quantityOptions}
                totalPrice={totalPrice}
                handleEmptyCart={handleEmptyCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleQuantityChange={handleQuantityChange}
              />
            </div>
          )}
        </div>
        <button onClick={toggleCartVisibility} className="view-cart-button">View Cart</button>
      </div>
    </Router>
  );
}

export default App;
