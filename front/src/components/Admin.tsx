import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Product } from '../interfaces/product';
import '../App.css'

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

const Admin: React.FC = () => {
  const [productType, setProductType] = useState<SelectOption | null>({ value: 'all', label: 'All' });
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SelectSort | null>(null);
  const [newProduct, setNewProduct] = useState({ product_name: '', price: '', quantity: '', product_type: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products', { withCredentials: true });
        setProducts(response.data);
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
  };

  const handleSortChange = (selectedOption: SelectSort | null) => {
    setSortOption(selectedOption);
  };

  const handleInputChange = (id: number, field: string, value: string | number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleSaveChanges = (product: Product) => {
    axios.put('http://localhost:8080/update-product', {
      id: product.id,
      price: product.price,
      quantity: product.quantity
    }, {
      withCredentials: true
    })
    .then(response => {
      alert('Product updated successfully');
    })
    .catch(error => {
      console.error('Error updating product:', error);
      alert('Error updating product');
    });
  };

  const handleDeleteProduct = (id: number) => {
    axios.delete(`http://localhost:8080/delete-product/${id}`, {
      withCredentials: true
    })
    .then(response => {
      alert('Product deleted successfully');
      setProducts(products.filter(product => product.id !== id));
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    });
  };

  const handleNewProductChange = (field: string, value: string) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  // const handleAddProduct = () => {
  //   const productToAdd = {
  //     ...newProduct,
  //     price: parseFloat(newProduct.price),
  //     quantity: parseInt(newProduct.quantity),
  //     total_sales: 0
  //   };

  //   axios.post('http://localhost:8080/add-product', productToAdd, { withCredentials: true })
  //     .then(response => {
  //       alert('Product added successfully');
  //       setNewProduct({ product_name: '', price: '', quantity: '', product_type: '' });
  //       setProducts([...products, { ...productToAdd, id: response.data.id }]);
  //     })
  //     .catch(error => {
  //       console.error('Error adding product:', error);
  //       alert('Error adding product');
  //     });
  // };

  const productTypeFilter = productType && productType.value !== 'all'
    ? products.filter(product => product.product_type === productType.value)
    : products;

  const sortedProducts = [...productTypeFilter];

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

  return (
    <div className="Admin">
      <h2>Admin Page</h2>
      <h3>Product Types</h3>
      <Select
        options={types}
        onChange={handleTypeChange}
        defaultValue={{ value: 'all', label: 'All' }}
      />
      <h3>Sort by</h3>
      <Select
        options={sortOptions}
        onChange={handleSortChange}
      />
      <h1>Product Type: {productType?.value}</h1>
      <h3>Products</h3>
      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id}>
            <div>
              {product.product_name} - ${product.price} - Quantity: {product.quantity} - Total Sales: {product.total_sales} - Type: {product.product_type}
              <div>
                <label>Price: </label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleInputChange(product.id, 'price', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label>Quantity: </label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleInputChange(product.id, 'quantity', parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => handleSaveChanges(product)}>Save Changes</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Add new product</h3>
      <div>
        <p>Product Name: <input value={newProduct.product_name} onChange={(e) => handleNewProductChange('product_name', e.target.value)} /></p>
        <p>Price: <input value={newProduct.price} onChange={(e) => handleNewProductChange('price', e.target.value)} /></p>
        <p>Quantity: <input value={newProduct.quantity} onChange={(e) => handleNewProductChange('quantity', e.target.value)} /></p>
        <p>Type: <input value={newProduct.product_type} onChange={(e) => handleNewProductChange('product_type', e.target.value)} /></p>
        {/* <button onClick={handleAddProduct}>Add</button> */}
      </div>
    </div>
  );
}

export default Admin;
