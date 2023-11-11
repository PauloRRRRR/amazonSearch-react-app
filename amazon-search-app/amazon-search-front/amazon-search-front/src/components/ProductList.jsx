import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/products?searchTerm=${encodeURIComponent(searchTerm)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      
      {/* Add an input for the user to enter the search term */}
      <input
        type="text"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <button onClick={fetchData}>Search</button>

      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <strong>Title:</strong> {product.title}, <strong>Rating:</strong> {product.rating}, <img src={product.image} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
