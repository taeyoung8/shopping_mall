// src/components/Checkout.tsx
import React from 'react';
import Select from 'react-select';
import { Product } from '../interfaces/product';
import { SelectOption } from '../interfaces/selectOption';
import { useNavigate } from 'react-router-dom';

interface CheckoutProps {
  items: Product[];
  totalPrice: number;
}

const paymentOptions: SelectOption[] = [
  { value: 'balance', label: 'Balance' },
];

const Checkout: React.FC<CheckoutProps> = ({ items, totalPrice }) => {
  const navigate = useNavigate();

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to complete the purchase');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items, totalPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      alert('Purchase successful!');
      navigate('/');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during the purchase. Please try again.');
    }
  };

  return (
    <div className="Checkout">
      <h2>Checkout Page</h2>
      <ul>
        {items.map((product) => (
          <li key={product.id}>
            {product.product_name} - ${product.price} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      <h3>Pay with</h3>
      <Select
        options={paymentOptions}
      />
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}

export default Checkout;
