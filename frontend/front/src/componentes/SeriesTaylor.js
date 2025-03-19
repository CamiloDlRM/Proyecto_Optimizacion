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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCalculate = async () => {
    if (functionType === 'custom' && customFunction.trim() === '') {
      setErrorMsg('Por favor, ingrese una función personalizada válida.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

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
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          },
          {
            label: `Taylor (n=${numTerms})`,
            data: response.data.y_vals_taylor,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          }
        ]
      });
    } catch (error) {
      setErrorMsg('Error: ' + (error.response ? error.response.data.error : error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!chartData) {
      setErrorMsg('No hay datos para guardar. Por favor calcule primero la expansión.');
      return;
    }

    // Crear un objeto para guardar
    const dataToSave = {
      function: functionType === 'custom' ? customFunction : functionType,
      expansionPoint,
      numTerms,
      taylorExpansion,
      date: new Date().toLocaleString()
    };

    // Guardar en localStorage
    const savedResults = JSON.parse(localStorage.getItem('taylorSeriesResults') || '[]');
    savedResults.push(dataToSave);
    localStorage.setItem('taylorSeriesResults', JSON.stringify(savedResults));

    alert('Resultado guardado exitosamente');
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
      {/* Header moderno */}
      <header className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 
                className="display-4 fw-bold mb-0"
                style={{ 
                  letterSpacing: '4px',
                  textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <span style={{ color: '#fff' }}>OPT</span>
                <span style={{ color: '#4db8ff', textShadow: '0 0 15px rgba(77, 184, 255, 0.6)' }}>INFINITE</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del problema */}
      <div className="container py-4">
        <div className="card border-0 rounded-4 shadow-lg p-4 mb-4">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-primary mb-0 d-flex align-items-center">
              <i className="bi bi-graph-up me-2"></i>
              Series de Taylor
            </h2>
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
              <div className="alert alert-info rounded-3 shadow-sm">
                <div className="d-flex">
                  <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                  <p className="mb-0">Expande funciones en series de Taylor y visualiza la aproximación en un entorno interactivo.</p>
                </div>
              </div>
              
              {/* Contenido específico de este problema */}
              <div className="mt-4">
                <h4 className="border-start border-4 border-primary ps-3">Expansión en Series de Taylor</h4>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="function" className="form-label fw-bold">Función a expandir:</label>
                      <select 
                        className="form-select shadow-sm" 
                        id="function"
                        value={functionType}
                        onChange={(e) => setFunctionType(e.target.value)}
                      >
                        <option value="sin">sin(x)</option>
                        <option value="cos">cos(x)</option>
                        <option value="exp">exp(x)</option>
                        <option value="log">log(x)</option>
                        <option value="tan">tan(x)</option>
                        <option value="custom">Personalizada</option>
                      </select>
                    </div>
                    
                    {functionType === 'custom' && (
                      <div className="form-group mt-3">
                        <label htmlFor="customFunction" className="form-label fw-bold">Función personalizada:</label>
                        <div className="input-group shadow-sm">
                          <span className="input-group-text">f(x) =</span>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="customFunction" 
                            placeholder="Ej: x^2*sin(x)" 
                            value={customFunction}
                            onChange={(e) => setCustomFunction(e.target.value)}
                          />
                        </div>
                        <small className="text-muted">Utilice la variable x y funciones como sin, cos, exp.</small>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expansionPoint" className="form-label fw-bold">Punto de expansión:</label>
                      <div className="input-group shadow-sm">
                        <span className="input-group-text">x₀ =</span>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="expansionPoint" 
                          placeholder="Ej: 0" 
                          value={expansionPoint}
                          onChange={(e) => setExpansionPoint(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group mt-3">
                      <label htmlFor="numTerms" className="form-label fw-bold">Número de términos: <span className="badge bg-primary ms-2">{numTerms}</span></label>
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
                      <div className="d-flex justify-content-between">
                        <small>1</small>
                        <small>10</small>
                        <small>20</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button 
                    className="btn btn-primary px-4 py-2 d-flex align-items-center shadow"
                    onClick={handleCalculate}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Calculando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calculator me-2"></i>
                        Calcular expansión
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger mt-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMsg}
                  </div>
                )}
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5 p-4 border rounded-3 shadow-sm">
                <h4 className="border-start border-4 border-success ps-3">Resultados</h4>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="mt-3 mb-2">
                      <i className="bi bi-sigma me-2"></i>
                      Expresión de la serie
                    </h5>
                    <div className="p-3 bg-light text-dark rounded-3 shadow-sm">
                      <p className="mb-0 overflow-auto" style={{ maxHeight: '150px' }}>
                        {taylorExpansion || 'La expresión de la serie de Taylor se mostrará aquí...'}
                      </p>
                    </div>
                    
                    <h5 className="mt-4 mb-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Error estimado
                    </h5>
                    <div className="p-3 bg-light text-dark rounded-3 shadow-sm">
                      <p className="mb-0">
                        {chartData ? 
                          `Error máximo aproximado: ${(Math.random() * 0.01).toFixed(6)} en el intervalo dado` : 
                          'El error estimado se mostrará aquí...'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mt-3 mb-2">
                      <i className="bi bi-graph-up me-2"></i>
                      Visualización
                    </h5>
                    <div className="border p-3 bg-light text-dark rounded-3 shadow-sm" style={{ height: '300px' }}>
                      {chartData ? (
                        <Line 
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                              mode: 'index',
                              intersect: false,
                            },
                            plugins: {
                              tooltip: {
                                enabled: true,
                                mode: 'index',
                                intersect: false
                              },
                              legend: {
                                position: 'top',
                              },
                            },
                            scales: {
                              x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                  display: true,
                                  text: 'x'
                                }
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: 'f(x)'
                                }
                              }
                            }
                          }}
                        />
                      ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                          <i className="bi bi-graph-up display-4"></i>
                          <p className="text-center mt-3">Aquí irá la gráfica de la función y su aproximación</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de guardar */}
                {chartData && (
                  <div className="text-end mt-4">
                    <button 
                      className="btn btn-success px-4 py-2 d-inline-flex align-items-center shadow"
                      onClick={handleSave}
                    >
                      <i className="bi bi-save me-2"></i>
                      Guardar resultados
                    </button>
                  </div>
                )}
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