import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
