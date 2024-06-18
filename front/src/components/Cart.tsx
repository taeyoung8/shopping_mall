import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../interfaces/product';
import Select from 'react-select';
import '../App.css';

interface SelectOption {
  value: string;
  label: string;
}

interface CartProps {
  items: Product[];
  quantityOptions: SelectOption[];
  totalPrice: number;
  handleEmptyCart: () => void;
  handleDecreaseQuantity: (id: number) => void;
  handleIncreaseQuantity: (id: number) => void;
  handleQuantityChange: (id: number, selectedOption: SelectOption | null) => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  quantityOptions,
  totalPrice,
  handleEmptyCart,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleQuantityChange
}) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart">
      <h3>Cart</h3>

      <ul>
        {items.map((product, index) => (
          <li key={index}>
            <div className="product-details">
              <div className="product-name">{product.product_name}</div>
              <div className="product-info">
                ${Number(product.price).toFixed(2)} - Quantity: {product.quantity}
              </div>
            </div>
            <div className="quantity-controls">
              <button onClick={() => handleDecreaseQuantity(product.id)}>-</button>
              {product.quantity}
              <button onClick={() => handleIncreaseQuantity(product.id)}>+</button>
              <Select
                options={quantityOptions}
                value={{ value: product.quantity.toString(), label: product.quantity.toString() }}
                onChange={(selectedOption) => handleQuantityChange(product.id, selectedOption)}
                className="quantity-selector"
              />
            </div>
          </li>
        ))}
      </ul>
      <h3 className="total-price">Total Price: ${totalPrice.toFixed(2)}</h3>
      <div className="button-group">
        <button onClick={handleEmptyCart}>Empty Cart</button>
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
