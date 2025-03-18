import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

// Selecciona el contenedor raíz en el DOM donde se montará la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza el componente principal <App /> dentro de React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres medir el rendimiento de tu aplicación, pasa una función
// para registrar resultados (por ejemplo: reportWebVitals(console.log))
// o envíalos a un servicio de análisis. Más información en https://bit.ly/CRA-vitals
reportWebVitals();
