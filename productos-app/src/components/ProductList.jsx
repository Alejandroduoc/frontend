import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos');
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => [...prev, producto]);
  };

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  const handlePagar = async () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/pago/crear', {
        amount: total,
        sessionId: `sess_${Math.random().toString(36).substring(7)}`,
        buyOrder: `orden_carrito_${Date.now()}`
      });

      const { url, token } = response.data;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago.');
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {productos.map((producto) => (
          <div key={producto.codigo} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            {producto.imagen && <img src={producto.imagen} alt={producto.nombre} width="150" />}
            <br />
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
          </div>
        ))}
      </div>

      <hr />
      <h2>🛒 Carrito</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          <ul>
            {carrito.map((p, i) => (
              <li key={i}>{p.nombre} - ${p.precio}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${total}</p>
          <button onClick={handlePagar}>Pagar con Webpay</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
