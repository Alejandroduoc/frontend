// src/components/PaymentButton.tsx
import React from 'react';

const PaymentButton = () => {
  const handlePay = async () => {
    const response = await fetch('http://localhost:3001/api/pago/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 10000,
        sessionId: 'session_1234',
        buyOrder: 'order_5678'
      })
    });

    const data = await response.json();

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.url;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token_ws';
    input.value = data.token;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  return <button onClick={handlePay}>Pagar con Webpay</button>;
};

export default PaymentButton;
