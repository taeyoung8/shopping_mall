import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Product } from '../interfaces/product';
import '../App.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectSort {
  value: string;
  label: string;
}

const quantityOptions: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString()
}));

const sortOptions: SelectSort[] = [
  { value: 'price_lth', label: 'Price: Low to High' },
  { value: 'price_htl', label: 'Price: High to Low' },
  { value: 'quantity', label: 'By Quantity: Low to High' }
];

interface ViewProps {
  addToCart: (product: Product, quantity: number) => void;
}

const View: React.FC<ViewProps> = ({ addToCart }) => {
  const [productType, setProductType] = useState<SelectOption | null>({ value: 'all', label: 'All' });
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SelectSort | null>(sortOptions[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products', { withCredentials: true });
        setProducts(response.data);
        setFilteredProducts(response.data);
        const uniqueTypes = Array.from(new Set(response.data.map((product: Product) => product.product_type)))
          .map((type) => ({
            value: type as string,
            label: type as string
          }));
        uniqueTypes.unshift({ value: 'all', label: 'All' });
        setTypes(uniqueTypes);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTypeChange = (selectedOption: SelectOption | null) => {
    setProductType(selectedOption);
    if (selectedOption && selectedOption.value !== 'all') {
      setFilteredProducts(products.filter(product => product.product_type === selectedOption.value));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSortChange = (selectedOption: SelectSort | null) => {
    setSortOption(selectedOption);
  };

  const handleSearch = () => {
    let filtered = products;
    if (productType && productType.value !== 'all') {
      filtered = filtered.filter(product => product.product_type === productType.value);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const handleReset = () => {
    setProductType({ value: 'all', label: 'All' });
    setSortOption(sortOptions[0]);
    setSearchTerm('');
    setFilteredProducts(products);
  };

  const handleQuantityChange = (productId: number, selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setQuantities({ ...quantities, [productId]: parseInt(selectedOption.value) });
    }
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;  // Default to 1 if no quantity selected
    addToCart(product, quantity);
  };

  const sortedProducts = [...filteredProducts];

  if (sortOption) {
    sortedProducts.sort((a, b) => {
      if (sortOption.value === 'price_lth') {
        return a.price - b.price;
      } else if (sortOption.value === 'price_htl') {
        return b.price - a.price;
      } else if (sortOption.value === 'quantity') {
        return a.quantity - b.quantity;
      }
      return 0;
    });
  }

  const openImageInNewWindow = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="View">
      <div className="filter-row">
        <div className="react-select-container">
          <h3>Product Types</h3>
          <Select
            options={types}
            onChange={handleTypeChange}
            value={productType}
          />
        </div>
        <div className="react-select-container">
          <h3>Sort by</h3>
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            value={sortOption}
          />
        </div>
      </div>
      <div className="search-row">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id}>
            <div className="product-details">
              <div className="product-name">{product.product_name}</div>
              <div className="product-price">${product.price}</div>
              <div className="product-quantity">Quantity: {product.quantity}</div>
              <div className="product-sales">Total Sales: {product.total_sales}</div>
              <div className="product-type">Type: {product.product_type}</div>
              <div className="action-row">
                <Select
                  options={quantityOptions}
                  className="quantity-selector"
                  onChange={(selectedOption) => handleQuantityChange(product.id, selectedOption)}
                />
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            </div>
            <img
              src={product.product_url}
              alt={product.product_name}
              className="product-image"
              onClick={() => openImageInNewWindow(product.product_url)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default View;
