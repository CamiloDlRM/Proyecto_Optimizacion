import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MatricesSparse({ onBack }) {
  // Estados para las opciones seleccionadas
  const [metodo, setMetodo] = useState('');
  const [operacion, setOperacion] = useState('');
  const [filas, setFilas] = useState(100);
  const [columnas, setColumnas] = useState(100);
  const [densidad, setDensidad] = useState(0.05);
  const [mostrarResultadosExperimento, setMostrarResultadosExperimento] = useState(false);
  const [mostrarResultadosOperaciones, setMostrarResultadosOperaciones] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  // Estados para mostrar los resultados al usuario
  const [tiempoExpMet, setTiempoExpMet] = useState(null);
  const [tiempoExpSparse, setTiempoExpSparse] = useState(null);
  const [tiempoExpDensas, setTiempoExpDensas] = useState(null);
  const [tiempoOp, setTiempoOp] = useState(null);

  // Verificar si las opciones son válidas para habilitar los botones
  useEffect(() => {
    if (metodo && filas > 0 && columnas > 0) {
      setBotonHabilitado(true);
    } else {
      setBotonHabilitado(false);
    }
  }, [metodo, filas, columnas]);

  // Función para ejecutar el experimento predefinido
  const ejecutarExperimento = async () => {
    try {
      const payload = {
        experiment_type: 'exp',
        n: filas,
        m: columnas
      };
      const res = await fetch('http://localhost:5008/Activity_2/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }
      setTiempoExpMet(data.tiempomat);
      setTiempoExpSparse(data.tiemposparse);
      setTiempoExpDensas(data.tiempodensas);

      setMostrarResultadosExperimento(true);
      setMostrarResultadosOperaciones(false);
    } catch (error) {
      console.error('Error al ejecutar experimento:', error);
      alert('Ocurrió un error ejecutando el experimento.');
    }
  };

  // Función para ejecutar experimento personalizado (operaciones)
  const ejecutarOperaciones = async () => {
    if (!operacion) {
      alert('Por favor selecciona una operación');
      return;
    }
    try {
      const payload = {
        experiment_type: 'user',
        n: filas,
        m: columnas,
        metodo,
        operacion,
        densidad
      };
      const res = await fetch('http://localhost:5008/Activity_2/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }
      setTiempoOp(data.tiempo);

      setMostrarResultadosOperaciones(true);
      setMostrarResultadosExperimento(false);
    } catch (error) {
      console.error('Error al ejecutar operaciones:', error);
      alert('Ocurrió un error ejecutando la operación.');
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
      {/* Header */}
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

      {/* Contenido */}
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
                <p className="mb-0">
                  Selecciona un método de representación y compara tiempos de ejecución en diferentes escenarios.
                </p>
              </div>

              {/* Opciones de configuración */}
              <div className="mt-4">
                <h4>Configuración</h4>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label>Método de representación:</label>
                    <select 
                      className="form-control"
                      value={metodo}
                      onChange={(e) => setMetodo(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un método</option>
                      <option value="COO">Coordenadas (COO)</option>
                      <option value="CSR">Compressed Sparse Row (CSR)</option>
                      <option value="CSC">Compressed Sparse Column (CSC)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label>Operación:</label>
                    <select
                      className="form-control"
                      value={operacion}
                      onChange={(e) => setOperacion(e.target.value)}
                    >
                      <option value="">Selecciona una operación</option>
                      <option value="multiplicacion">Multiplicación</option>
                      <option value="suma">Suma</option>
                      <option value="resta">Resta</option>
                      <option value="transpuesta">Transpuesta</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label>Dimensiones de la matriz:</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Filas"
                        min="1"
                        value={filas}
                        onChange={(e) => setFilas(parseInt(e.target.value))}
                      />
                      <span className="input-group-text">×</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Columnas"
                        min="1"
                        value={columnas}
                        onChange={(e) => setColumnas(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>
                      Densidad (entre 0 y 1): {densidad.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="0.01"
                      max="1"
                      step="0.01"
                      value={densidad}
                      onChange={(e) => setDensidad(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-primary px-4 py-2 ${!botonHabilitado ? 'disabled' : ''}`}
                    onClick={ejecutarExperimento}
                    disabled={!botonHabilitado}
                  >
                    Ejecutar Experimento
                  </button>

                  <button
                    className={`btn btn-info px-4 py-2 ${!botonHabilitado ? 'disabled' : ''}`}
                    onClick={ejecutarOperaciones}
                    disabled={!botonHabilitado}
                  >
                    Ejecutar Operaciones
                  </button>
                </div>
              </div>

              {/* Resultados del experimento */}
              {mostrarResultadosExperimento && (
                <div className="mt-5">
                  <h4>Resultados del Experimento</h4>
                  <div className="mt-4">
                    <h5>Tabla de resultados</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead className="table-primary">
                          <tr>
                            <th>Método</th>
                            <th>Tiempo (ms)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Método propio</td>
                            <td className="text-muted">
                              {tiempoExpMet !== null ? tiempoExpMet : 'Pendiente...'}
                            </td>
                          </tr>
                          <tr>
                            <td>COO Sparse</td>
                            <td className="text-muted">
                              {tiempoExpSparse !== null ? tiempoExpSparse : 'Pendiente...'}
                            </td>
                          </tr>
                          <tr>
                            <td>Densas</td>
                            <td className="text-muted">
                              {tiempoExpDensas !== null ? tiempoExpDensas : 'Pendiente...'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      className="btn btn-success px-4 py-2"
                      onClick={() => {
                        alert('Resultados guardados');
                      }}
                    >
                      <i className="bi bi-save me-2"></i>
                      Guardar Resultados
                    </button>
                  </div>
                </div>
              )}

              {/* Resultados de operaciones */}
              {mostrarResultadosOperaciones && (
                <div className="mt-5">
                  <h4>Resultados de Operaciones</h4>
                  <div className="mt-4">
                    <h5>Tiempo de Operación: {operacion}</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead className="table-primary">
                          <tr>
                            <th>Método</th>
                            <th>Tiempo (ms)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Método Seleccionado ({metodo})</td>
                            <td className="text-muted">
                              {tiempoOp !== null ? tiempoOp : 'Pendiente...'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      className="btn btn-success px-4 py-2"
                      onClick={() => {
                        alert('Resultados guardados');
                      }}
                    >
                      <i className="bi bi-save me-2"></i>
                      Guardar Resultados
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4" style={{ background: 'rgba(0, 15, 31, 0.7)' }}>
        <div className="container text-center">
          <p className="mb-0 text-light opacity-75">
            © 2025 OPTINFINITE - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MatricesSparse;