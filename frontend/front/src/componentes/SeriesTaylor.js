import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SeriesTaylor({ onBack }) {
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
                      <select className="form-control" id="function">
                        <option value="sin">sin(x)</option>
                        <option value="cos">cos(x)</option>
                        <option value="exp">exp(x)</option>
                        <option value="log">log(x)</option>
                        <option value="custom">Personalizada</option>
                      </select>
                    </div>
                    
                    <div className="form-group mt-3" id="customFunctionContainer" style={{ display: 'none' }}>
                      <label htmlFor="customFunction">Función personalizada:</label>
                      <input type="text" className="form-control" id="customFunction" placeholder="Ej: x^2*sin(x)" />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expansionPoint">Punto de expansión:</label>
                      <input type="number" className="form-control" id="expansionPoint" placeholder="Ej: 0" defaultValue="0" />
                    </div>
                    
                    <div className="form-group mt-3">
                      <label htmlFor="numTerms">Número de términos:</label>
                      <input type="range" className="form-range" id="numTerms" min="1" max="20" step="1" defaultValue="5" />
                      <div className="text-center">5 términos</div>
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-primary px-4 py-2">Calcular expansión</button>
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5 p-3 border rounded">
                <h4>Resultados</h4>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Expresión de la serie</h5>
                    <div className="p-3 bg-light text-dark rounded">
                      <p>La expresión de la serie de Taylor se mostrará aquí...</p>
                    </div>
                    
                    <h5 className="mt-4">Error estimado</h5>
                    <div className="p-3 bg-light text-dark rounded">
                      <p>El error estimado se mostrará aquí...</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Visualización</h5>
                    <div className="border p-3 bg-light text-dark" style={{ height: '300px' }}>
                      <p className="text-center">Aquí irá la gráfica de la función y su aproximación</p>
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