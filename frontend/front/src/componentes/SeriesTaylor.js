import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

function SeriesTaylor({ onBack }) {
  const [functionType, setFunctionType] = useState('sin');
  const [customFunction, setCustomFunction] = useState('');
  const [expansionPoint, setExpansionPoint] = useState(0);
  const [numTerms, setNumTerms] = useState(5);
  const [taylorExpansion, setTaylorExpansion] = useState('');
  const [chartData, setChartData] = useState(null);

  const handleCalculate = async () => {
    if (functionType === 'custom' && customFunction.trim() === '') {
      alert('Por favor, ingrese una función personalizada válida.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5008/taylor_series', {
        function: functionType,
        x0: expansionPoint,
        n: numTerms,
        custom_function: customFunction
      });

      setTaylorExpansion(response.data.taylor_expansion);
      setChartData({
        labels: response.data.x_vals,
        datasets: [
          {
            label: 'Original',
            data: response.data.y_vals_original,
            borderColor: 'blue',
            fill: false
          },
          {
            label: `Taylor (n=${numTerms})`,
            data: response.data.y_vals_taylor,
            borderColor: 'red',
            fill: false
          }
        ]
      });
    } catch (error) {
      alert('Error: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ 
        background: 'linear-gradient(135deg, #001f3f, #004080)',
        backgroundSize: 'cover',
        color: '#fff'
      }}
    >
      {/* Header simplificado */}
      <header className="py-3">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 
                className="display-4 fw-bold mb-0"
                style={{ 
                  letterSpacing: '3px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                <span style={{ color: '#fff' }}>OPT</span>
                <span style={{ color: '#4db8ff' }}>INFINITE</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del problema */}
      <div className="container py-4">
        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-primary mb-0">Series de Taylor</h2>
            <button 
              className="btn btn-outline-secondary px-3 py-1 rounded-pill"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>
          
          <div className="row">
            <div className="col-md-12">
              <div className="alert alert-info">
                <p className="mb-0">Expande funciones en series de Taylor y visualiza la aproximación en un entorno interactivo.</p>
              </div>
              
              {/* Contenido específico de este problema */}
              <div className="mt-4">
                <h4>Expansión en Series de Taylor</h4>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="function">Función a expandir:</label>
                      <select 
                        className="form-control" 
                        id="function"
                        value={functionType}
                        onChange={(e) => setFunctionType(e.target.value)}
                      >
                        <option value="sin">sin(x)</option>
                        <option value="cos">cos(x)</option>
                        <option value="exp">exp(x)</option>
                        <option value="log">log(x)</option>
                        <option value="custom">Personalizada</option>
                      </select>
                    </div>
                    
                    {functionType === 'custom' && (
                      <div className="form-group mt-3">
                        <label htmlFor="customFunction">Función personalizada:</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="customFunction" 
                          placeholder="Ej: x^2*sin(x)" 
                          value={customFunction}
                          onChange={(e) => setCustomFunction(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expansionPoint">Punto de expansión:</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="expansionPoint" 
                        placeholder="Ej: 0" 
                        value={expansionPoint}
                        onChange={(e) => setExpansionPoint(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group mt-3">
                      <label htmlFor="numTerms">Número de términos:</label>
                      <input 
                        type="range" 
                        className="form-range" 
                        id="numTerms" 
                        min="1" 
                        max="20" 
                        step="1" 
                        value={numTerms}
                        onChange={(e) => setNumTerms(e.target.value)}
                      />
                      <div className="text-center">{numTerms} términos</div>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary px-4 py-2"
                  onClick={handleCalculate}
                >
                  Calcular expansión
                </button>
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5 p-3 border rounded">
                <h4>Resultados</h4>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Expresión de la serie</h5>
                    <div className="p-3 bg-light text-dark rounded">
                      <p>{taylorExpansion || 'La expresión de la serie de Taylor se mostrará aquí...'}</p>
                    </div>
                    
                    <h5 className="mt-4">Error estimado</h5>
                    <div className="p-3 bg-light text-dark rounded">
                      <p>El error estimado se mostrará aquí...</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Visualización</h5>
                    <div className="border p-3 bg-light text-dark" style={{ height: '300px' }}>
                      {chartData ? (
                        <Line 
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                type: 'linear',
                                position: 'bottom'
                              }
                            }
                          }}
                        />
                      ) : (
                        <p className="text-center">Aquí irá la gráfica de la función y su aproximación</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4" style={{ background: 'rgba(0, 15, 31, 0.7)' }}>
        <div className="container text-center">
          <p className="mb-0 text-light opacity-75">© 2025 OPTINFINITE - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default SeriesTaylor;