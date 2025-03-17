import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function OptimizacionDosVariables({ onBack }) {
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
            <h2 className="text-primary mb-0">Optimización de Dos Variables</h2>
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
                <p className="mb-0">Define una función de costo y visualiza su región factible con diferentes métodos gráficos.</p>
              </div>
              
              {/* Aquí irá todo el contenido específico de este problema */}
              <div className="mt-4">
                <h4>Definición del problema</h4>
                <p>Aquí va la explicación y formularios para trabajar con optimización de dos variables...</p>
                
                {/* Puedes agregar aquí formularios, gráficos, etc. */}
                <div className="form-group mb-3">
                  <label htmlFor="function">Función objetivo:</label>
                  <input type="text" className="form-control" id="function" placeholder="Ej: 2*x + 3*y" />
                </div>
                
                <div className="form-group mb-3">
                  <label>Restricciones:</label>
                  <div className="input-group mb-2">
                    <input type="text" className="form-control" placeholder="Ej: x + y <= 10" />
                    <button className="btn btn-outline-secondary">+</button>
                  </div>
                </div>
                
                <button className="btn btn-primary px-4 py-2">Calcular óptimo</button>
              </div>
              
              {/* Área para resultados */}
              <div className="mt-5 p-3 border rounded">
                <h4>Resultados</h4>
                <p>Los resultados de la optimización se mostrarán aquí...</p>
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

export default OptimizacionDosVariables;