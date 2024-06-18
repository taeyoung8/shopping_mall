export interface Product {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  total_sales: number;
  product_type: string;
  imageUrl: string; // Image URL for the product
  product_url: string; // Add this line for the product URL
}
