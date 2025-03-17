import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MainPage({ onLogout, onSelectProblem }) {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ 
        background: 'linear-gradient(135deg, #001f3f, #004080)',
        backgroundSize: 'cover',
        color: '#fff'
      }}
    >
      {/* Header con diseño mejorado y título optimizado */}
      <header className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h1 
                className="display-3 fw-bold mb-0"
                style={{ 
                  letterSpacing: '3px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                <span style={{ color: '#fff' }}>OPT</span>
                <span style={{ color: '#4db8ff' }}>INFINITE</span>
              </h1>
              <div className="d-flex justify-content-center">
                <div className="border-bottom border-light opacity-50" style={{ width: '120px' }}></div>
              </div>
              <p className="lead mt-3 text-light opacity-75">Laboratorio 1: Exploración de Optimización</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal con diseño mejorado */}
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-light mb-4">Experimenta con problemas de optimización</h2>
          </div>
        </div>

        <div className="row g-4">
          {/* Tarjeta 1 - Optimización de dos variables */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition" 
                 style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#001f3f' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{ width: '48px', height: '48px', background: '#001f3f', color: 'white' }}>
                    <span className="fw-bold">1</span>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Optimización de Dos Variables</h3>
                </div>
                <p className="card-text text-muted mb-4">Define una función de costo y visualiza su región factible con diferentes métodos gráficos.</p>
                <button className="btn btn-primary px-4 py-2 rounded-pill" 
                        style={{ background: '#004080', borderColor: '#004080' }}
                        onClick={() => onSelectProblem("problem1")}>
                  <span className="me-2">Explorar</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tarjeta 2 - Matrices Sparse */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition"
                 style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#001f3f' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '48px', height: '48px', background: '#001f3f', color: 'white' }}>
                    <span className="fw-bold">2</span>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Matrices Sparse</h3>
                </div>
                <p className="card-text text-muted mb-4">Selecciona un método de representación y compara tiempos de ejecución en diferentes escenarios.</p>
                <button className="btn btn-primary px-4 py-2 rounded-pill"
                        style={{ background: '#004080', borderColor: '#004080' }}
                        onClick={() => onSelectProblem("problem2")}>
                  <span className="me-2">Explorar</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          {/* Tarjeta 3 - Series de Taylor */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition"
                 style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#001f3f' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{ width: '48px', height: '48px', background: '#001f3f', color: 'white' }}>
                    <span className="fw-bold">3</span>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Series de Taylor</h3>
                </div>
                <p className="card-text text-muted mb-4">Expande funciones en series de Taylor y visualiza la aproximación en un entorno interactivo.</p>
                <button className="btn btn-primary px-4 py-2 rounded-pill"
                        style={{ background: '#004080', borderColor: '#004080' }}
                        onClick={() => onSelectProblem("problem3")}>
                  <span className="me-2">Explorar</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tarjeta 4 - Algoritmos de Optimización */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition"
                 style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#001f3f' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{ width: '48px', height: '48px', background: '#001f3f', color: 'white' }}>
                    <span className="fw-bold">4</span>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Algoritmos de Optimización</h3>
                </div>
                <p className="card-text text-muted mb-4">Prueba diferentes algoritmos y analiza sus parámetros con visualizaciones avanzadas.</p>
                <button className="btn btn-primary px-4 py-2 rounded-pill"
                        style={{ background: '#004080', borderColor: '#004080' }}
                        onClick={() => onSelectProblem("problem4")}>
                  <span className="me-2">Explorar</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer moderno */}
      <footer className="mt-auto py-4" style={{ background: 'rgba(0, 15, 31, 0.7)' }}>
        <div className="container text-center">
          <p className="mb-0 text-light opacity-75">© 2025 OPTINFINITE - Todos los derechos reservados</p>
          <button 
            className="btn btn-outline-light btn-sm mt-2"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;