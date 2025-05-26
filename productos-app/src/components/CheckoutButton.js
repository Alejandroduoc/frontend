// src/components/CheckoutButton.js
import React, { useState } from 'react';

function CheckoutButton({ amount, orderId, description }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Llamar a tu backend para iniciar la transacción
      // Asegúrate que la URL de tu backend sea correcta y que esté configurada para CORS si es necesario.
      const response = await fetch('http://localhost:3010/api/webpay/create', { // EJEMPLO: URL de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          buyOrder: orderId, // Transbank usa 'buyOrder'
          sessionId: 'session123', // Un identificador de sesión único
          returnUrl: 'http://localhost:3010/api/webpay/return' // IMPORTANTE: Esta es la URL de TU BACKEND
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al iniciar la transacción con Webpay');
      }

      const data = await response.json(); // Tu backend debe devolver { token, url }

      // 2. Crear un formulario y enviarlo para redirigir a Webpay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url; // URL de Webpay proporcionada por tu backend

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws'; // Para Webpay Plus, el campo se llama 'token_ws'
      tokenInput.value = data.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error('Error en el proceso de pago:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={handlePayment} disabled={isLoading}>
        {isLoading ? 'Procesando...' : `Pagar $${amount} con Webpay`}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
  );
}

export default CheckoutButton;