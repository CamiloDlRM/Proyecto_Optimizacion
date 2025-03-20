import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AlgoritmosOptimizacion({ onBack }) {
  const [funcionObjetivo, setFuncionObjetivo] = useState('');
  const [metodo, setMetodo] = useState('');
  const [puntoInicial, setPuntoInicial] = useState('0');
  const [tasaAprendizaje, setTasaAprendizaje] = useState(0.01);
  const [tolerancia, setTolerancia] = useState(0.0001);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  const [resultados, setResultados] = useState(null);
  const [plotImage, setPlotImage] = useState(null);

  useEffect(() => {
    if (funcionObjetivo && metodo && puntoInicial) {
      setBotonHabilitado(true);
    } else {
      setBotonHabilitado(false);
    }
  }, [funcionObjetivo, metodo, puntoInicial]);

  const ejecutarOptimizacion = async () => {
    try {
      const payload = {
        function: funcionObjetivo,
        method: metodo,
        initialPoint: puntoInicial,
        tolerance: tolerancia,
        learningRate: metodo === 'gradiente' ? tasaAprendizaje : undefined
      };

      const response = await axios.post('http://localhost:5008/Activity_4/evaluate', payload);
      setResultados(response.data);
      setMostrarResultados(true);

      // Si el backend retorna plot_image en base64, lo mostramos como <img>
      if (response.data.plot_image) {
        setPlotImage(`data:image/png;base64,${response.data.plot_image}`);
      } else {
        setPlotImage(null);
      }
    } catch (error) {
      console.error('Error optimizando:', error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Ocurrió un error al ejecutar la optimización.');
      }
    }
  };

  const guardarResultados = () => {
    alert('Resultados guardados correctamente');
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

      <div className="container py-4">
        <div className="card border-0 rounded-4 shadow p-4 mb-4">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-0">Algoritmos de Optimización</h2>
              <p className="text-muted mb-0 mt-1">Resuelve problemas complejos con algoritmos avanzados</p>
            </div>
            <button
              className="btn btn-outline-secondary rounded-pill px-3 py-2"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="alert alert-info rounded-3 d-flex align-items-center">
                <i className="bi bi-info-circle fs-4 me-3"></i>
                <p className="mb-0">
                  Ingresa una función objetivo, selecciona un método y configura los parámetros iniciales.
                </p>
              </div>

              <div className="mt-4 bg-light p-4 rounded-4">
                <h4 className="border-bottom pb-3 mb-4">Configuración de la optimización</h4>

                <div className="form-group mb-4">
                  <label className="form-label fw-bold">Función objetivo:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-function"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Ej: (1-x)**2 + 100*(y-x**2)**2"
                      value={funcionObjetivo}
                      onChange={(e) => setFuncionObjetivo(e.target.value)}
                      required
                    />
                  </div>
                  <small className="form-text text-muted mt-2">
                    <i className="bi bi-lightbulb me-1"></i>
                    Usa 'x', 'y', 'z' como variables, '**' para potencias, '*' para multiplicación
                  </small>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Método de optimización:</label>
                    <select
                      className="form-select form-select-lg"
                      value={metodo}
                      onChange={(e) => setMetodo(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un método</option>
                      <option value="gradiente">Gradiente Descendiente</option>
                      <option value="newton">Newton-Raphson</option>
                      <option value="bfgs">BFGS</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Punto inicial (x₀):</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Ej: 0,0"
                        value={puntoInicial}
                        onChange={(e) => setPuntoInicial(e.target.value)}
                        required
                      />
                    </div>
                    <small className="form-text text-muted mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Para funciones multivariables, separa los valores con comas (ej: 1,2)
                    </small>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  {metodo === 'gradiente' && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Tasa de aprendizaje:</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-sliders"></i>
                        </span>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          value={tasaAprendizaje}
                          onChange={(e) => setTasaAprendizaje(parseFloat(e.target.value))}
                          step="0.001"
                          min="0.001"
                        />
                      </div>
                    </div>
                  )}
                  <div className={metodo === 'gradiente' ? 'col-md-6' : 'col-md-12'}>
                    <label className="form-label fw-bold">Tolerancia:</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-bullseye"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={tolerancia}
                        onChange={(e) => setTolerancia(parseFloat(e.target.value))}
                        step="0.0001"
                        min="0.0000001"
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className={`btn btn-primary btn-lg ${!botonHabilitado ? 'disabled' : ''}`}
                    onClick={ejecutarOptimizacion}
                    disabled={!botonHabilitado}
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    Ejecutar optimización
                  </button>
                </div>
              </div>

              {mostrarResultados && (
                <div className="mt-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Resultados de la optimización</h4>
                    <button
                      className="btn btn-success rounded-pill px-4 py-2"
                      onClick={guardarResultados}
                    >
                      <i className="bi bi-save me-2"></i>
                      Guardar resultados
                    </button>
                  </div>

                  <div className="row g-4">
                    {/* Muestra la imagen generada desde el backend */}
                    <div className="col-12">
                      <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-primary text-white p-3 rounded-top-4">
                          <h5 className="mb-0">
                            <i className="bi bi-graph-up me-2"></i>Convergencia
                          </h5>
                        </div>
                        <div className="card-body p-4 bg-light text-dark">
                          {plotImage ? (
                            <div className="text-center">
                              <img
                                src={plotImage}
                                alt="Gráfica de convergencia"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          ) : (
                            <div style={{ height: '300px' }} className="d-flex align-items-center justify-content-center">
                              <div className="text-center">
                                <i className="bi bi-bar-chart-line fs-1 text-muted"></i>
                                <p className="text-muted mt-3">Esperando datos de convergencia...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta con resultados detallados */}
                    <div className="col-12">
                      <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-primary text-white p-3 rounded-top-4">
                          <h5 className="mb-0">
                            <i className="bi bi-clipboard-data me-2"></i>Resultados detallados
                          </h5>
                        </div>
                        <div className="card-body p-4 bg-light text-dark">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-3">
                                <i className="bi bi-bullseye me-2"></i>Solución óptima:
                              </h6>
                              <table className="table table-bordered table-hover">
                                <tbody>
                                  <tr>
                                    <th className="bg-light">x*</th>
                                    <td className="text-muted">
                                      {resultados 
                                        ? Array.isArray(resultados.result_x) 
                                          ? resultados.result_x.map((val, i) => `x${i+1}: ${val.toFixed(4)}`).join(', ')
                                          : resultados.result_x.toFixed(4)
                                        : 'Pendiente...'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">f(x*)</th>
                                    <td className="text-muted">
                                      {resultados ? resultados.result_f.toFixed(6) : 'Pendiente...'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-3">
                                <i className="bi bi-speedometer2 me-2"></i>Métricas de ejecución:
                              </h6>
                              <table className="table table-bordered table-hover">
                                <tbody>
                                  <tr>
                                    <th className="bg-light">Iteraciones</th>
                                    <td className="text-muted">
                                      {resultados && resultados.iterations !== null
                                        ? resultados.iterations
                                        : 'Pendiente...'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Tiempo de ejecución</th>
                                    <td className="text-muted">
                                      {resultados
                                        ? resultados.execution_time.toFixed(4) + ' s'
                                        : 'Pendiente...'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-4" style={{ background: 'rgba(0, 15, 31, 0.8)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-light opacity-75">© 2025 OPTINFINITE - Todos los derechos reservados</p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-center justify-content-md-end">
                <a href="#" className="text-light opacity-75 mx-2">
                  <i className="bi bi-github"></i>
                </a>
                <a href="#" className="text-light opacity-75 mx-2">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-light opacity-75 mx-2">
                  <i className="bi bi-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AlgoritmosOptimizacion;
