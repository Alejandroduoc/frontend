// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import WebpayReturn from './components/WebpayReturn'; // Crearemos este componente

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductList />} />
          {/* Esta ruta recibirá al usuario después de que el backend procese el callback de Webpay */}
          <Route path="/webpay-result" element={<WebpayReturn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;