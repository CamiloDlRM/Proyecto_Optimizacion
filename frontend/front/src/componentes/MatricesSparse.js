import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MatricesSparse({ onBack }) {
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
            <h2 className="text-primary mb-0">Matrices Sparse</h2>
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
                <p className="mb-0">Selecciona un método de representación y compara tiempos de ejecución en diferentes escenarios.</p>
              </div>
              
              {/* Contenido específico de este problema */}
              <div className="mt-4">
                <h4>Métodos de representación</h4>
                <p>Elige un método para representar matrices sparse y evalúa su rendimiento:</p>
                
                <div className="form-group mb-3">
                  <label>Método de representación:</label>
                  <select className="form-control">
                    <option>Coordenadas (COO)</option>
                    <option>Lista de listas (LIL)</option>
                    <option>Compressed Sparse Row (CSR)</option>
                    <option>Compressed Sparse Column (CSC)</option>
                  </select>
                </div>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label>Dimensiones de la matriz:</label>
                    <div className="input-group">
                      <input type="number" className="form-control" placeholder="Filas" min="1" defaultValue="100" />
                      <span className="input-group-text">×</span>
                      <input type="number" className="form-control" placeholder="Columnas" min="1" defaultValue="100" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>Densidad (porcentaje no-cero):</label>
                    <input type="range" className="form-range" min="0.1" max="50" step="0.1" defaultValue="5" />
                    <div className="text-center">5%</div>
                  </div>
                </div>
                
                <button className="btn btn-primary px-4 py-2">Generar y analizar</button>
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5 p-3 border rounded">
                <h4>Resultados del análisis</h4>
                <p>Los resultados del análisis de rendimiento se mostrarán aquí...</p>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Memoria utilizada</h5>
                    <div className="border p-3 bg-light text-dark">
                      <p>Gráfico de uso de memoria va aquí</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Tiempo de ejecución</h5>
                    <div className="border p-3 bg-light text-dark">
                      <p>Gráfico de tiempo de ejecución va aquí</p>
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

export default MatricesSparse;