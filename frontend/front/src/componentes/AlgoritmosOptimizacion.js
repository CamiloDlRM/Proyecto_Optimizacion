import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AlgoritmosOptimizacion({ onBack }) {
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
            <h2 className="text-primary mb-0">Algoritmos de Optimización</h2>
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
                <p className="mb-0">Prueba diferentes algoritmos y analiza sus parámetros con visualizaciones avanzadas.</p>
              </div>
              
              {/* Contenido específico de este problema */}
              <div className="mt-4">
                <h4>Selección de algoritmo y función</h4>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Función objetivo:</label>
                      <select className="form-control">
                        <option>Rosenbrock</option>
                        <option>Rastrigin</option>
                        <option>Ackley</option>
                        <option>Sphere</option>
                        <option>Beale</option>
                        <option>Personalizada</option>
                      </select>
                    </div>
                    
                    <div className="form-group mt-3" style={{ display: 'none' }}>
                      <label>Función personalizada:</label>
                      <input type="text" className="form-control" placeholder="Ej: (1-x)^2 + 100*(y-x^2)^2" />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Algoritmo:</label>
                      <select className="form-control">
                        <option>Gradiente descendente</option>
                        <option>Newton-Raphson</option>
                        <option>BFGS</option>
                        <option>Nelder-Mead</option>
                        <option>Algoritmo genético</option>
                        <option>Particle Swarm Optimization</option>
                      </select>
                    </div>
                    
                    <div className="form-group mt-3">
                      <label>Dimensiones:</label>
                      <select className="form-control">
                        <option>2D</option>
                        <option>3D</option>
                        <option>nD</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5>Parámetros del algoritmo</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label>Tasa de aprendizaje:</label>
                      <input type="number" className="form-control" defaultValue="0.01" step="0.001" min="0.001" />
                    </div>
                    <div className="col-md-4">
                      <label>Máx. iteraciones:</label>
                      <input type="number" className="form-control" defaultValue="100" step="10" min="10" />
                    </div>
                    <div className="col-md-4">
                      <label>Tolerancia:</label>
                      <input type="number" className="form-control" defaultValue="0.0001" step="0.0001" min="0.0000001" />
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-primary px-4 py-2">Ejecutar optimización</button>
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5">
                <h4>Resultados de la optimización</h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white">
                        Visualización
                      </div>
                      <div className="card-body p-3 bg-light text-dark" style={{ height: '300px' }}>
                        <p className="text-center">Aquí irá la visualización gráfica del proceso de optimización</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white">
                        Convergencia
                      </div>
                      <div className="card-body p-3 bg-light text-dark">
                        <div style={{ height: '300px' }}>
                          <p className="text-center">Aquí irá la gráfica de convergencia</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-primary text-white">
                        Resultados detallados
                      </div>
                      <div className="card-body p-3 bg-light text-dark">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Solución óptima encontrada:</h6>
                            <code className="bg-dark text-light p-2 d-block">
                              x* = [0.0, 0.0] <br />
                              f(x*) = 0.0
                            </code>
                          </div>
                          <div className="col-md-6">
                            <h6>Resumen del proceso:</h6>
                            <ul>
                              <li>Iteraciones: 0</li>
                              <li>Tiempo de ejecución: 0 ms</li>
                              <li>Convergencia: No iniciado</li>
                            </ul>
                          </div>
                        </div>
                      </div>
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

export default AlgoritmosOptimizacion;