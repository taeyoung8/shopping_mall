import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface Product {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  total_sales: number;
  product_type: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const Search: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SelectOption | null>({ value: 'all', label: 'All' });

  const handleTypeChange = (selectedOption: SelectOption | null) => {
    setSelectedType(selectedOption);
  };

  const filteredProducts = selectedType && selectedType.value !== 'all'
  ? products.filter(product => product.product_type === selectedType.value)
  : products;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products', { withCredentials: true });
        setProducts(response.data);
        // extract unique product types
        const uniqueTypes = Array.from(new Set(response.data.map((product: Product) => product.product_type)))
          .map((type) => ({
            value: type as string,
            label: type as string
          }));
          //default type = all
        // Add "All" option to the beginning of the types array
        uniqueTypes.unshift({ value: 'all', label: 'All' });
        setTypes(uniqueTypes);
        setLoading(false);
      } catch (err){
        setError('Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Search Page</h2>
      Product Type<Select/>
      Sort by<Select/>
      <h3>Products</h3>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.product_name} - ${product.price} - Quantity: {product.quantity} - Total Sales: {product.total_sales} - Type: {product.product_type}
            <Select/>
            <button>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
