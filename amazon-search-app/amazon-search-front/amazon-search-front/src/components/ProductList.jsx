import { useState } from 'react';
import axios from 'axios';

import './global.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products?searchTerm=${encodeURIComponent(searchTerm)}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  return (
    <div className='container'>
      <h1>Amazon Search</h1>
      
      <input
        type="text"
        placeholder="Search for products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='searchBar'
      />
      
      <button onClick={handleSearch}>Search</button>

      <ul>
        {[...products.slice(4, -7)].map((product, index) => {
          // Split the rating text using the comma and take the part before it

          return (
            <li key={index}>
              <div>
                <img src={product.imageUrl} alt="" />
                {product.title}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductList;
