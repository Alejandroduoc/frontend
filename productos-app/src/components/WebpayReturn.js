// src/components/WebpayReturn.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function WebpayReturn() {
  const [paymentStatus, setPaymentStatus] = useState('Procesando...');
  const [details, setDetails] = useState(null);
  const location = useLocation(); // Para leer query params

  useEffect(() => {
    // Tu backend debería redirigir aquí con parámetros en la URL
    // Ejemplo: /webpay-result?status=COMMITTED&buyOrder=ORD123&amount=10000
    const params = new URLSearchParams(location.search);
    const status = params.get('status'); // El estado que tu backend determinó
    const buyOrder = params.get('buyOrder');
    const amount = params.get('amount');
    const authorizationCode = params.get('authorizationCode');
    const errorMessage = params.get('error');

    if (errorMessage) {
        setPaymentStatus(`Pago Fallido: ${errorMessage}`);
    } else if (status === 'COMMITTED' || status === 'AUTHORIZED') { // O el estado que tu backend defina como éxito
      setPaymentStatus('¡Pago Exitoso!');
      setDetails({ buyOrder, amount, authorizationCode });
    } else if (status) {
      setPaymentStatus(`Estado del Pago: ${status}`);
      setDetails({ buyOrder });
    } else {
      setPaymentStatus('No se pudo determinar el estado del pago.');
    }
  }, [location]);

  return (
    <div>
      <h1>Resultado del Pago</h1>
      <p>{paymentStatus}</p>
      {details && (
        <div>
          {details.buyOrder && <p>Orden de Compra: {details.buyOrder}</p>}
          {details.amount && <p>Monto: ${details.amount}</p>}
          {details.authorizationCode && <p>Código de Autorización: {details.authorizationCode}</p>}
        </div>
      )}
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default WebpayReturn;