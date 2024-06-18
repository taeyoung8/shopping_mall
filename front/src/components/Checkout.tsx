// src/components/Checkout.tsx
import React from 'react';
import Select from 'react-select';
import { Product } from '../interfaces/product';
import { SelectOption } from '../interfaces/selectOption';

interface CheckoutProps {
  items: Product[];
  totalPrice: number;
}

const paymentOptions: SelectOption[] = [
    { value: 'balance', label: 'Credit Card' },
  ];

const Checkout: React.FC<CheckoutProps> = ({ items, totalPrice }) => {
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
      /><button>Buy</button>
    </div>
  );
}

export default Checkout;
