import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AlgoritmosOptimizacion({ onBack }) {
  const [inputValues, setInputValues] = useState(Array(13).fill(''));
  const [allInputsFilled, setAllInputsFilled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [graphicResult, setGraphicResult] = useState(null);
  const [costFunctionValue, setCostFunctionValue] = useState(null);

  useEffect(() => {
    const areAllFilled = inputValues.every(value => value !== '' && value !== '0');
    setAllInputsFilled(areAllFilled);
  }, [inputValues]);

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleEvaluate = async () => {
    try {
      const payload = {
        func_obj_coef_x: inputValues[0],
        func_obj_coef_y: inputValues[1],
        resc1_coef_a: inputValues[2],
        resc1_coef_b: inputValues[3],
        resc1_coef_c: inputValues[4],
        resc2_coef_a: inputValues[5],
        resc2_coef_b: inputValues[6],
        resc2_coef_c: inputValues[7],
        resc3_coef_a: inputValues[8],
        resc3_coef_b: inputValues[9],
        resc3_coef_c: inputValues[10],
        evaluation_point_x: inputValues[11],
        evaluation_point_y: inputValues[12],
      };

      const response = await axios.post('http://localhost:5008/Activity_1/evaluate', payload);
      const data = response.data;

      setGraphicResult(data.graph);
      setCostFunctionValue(data.objective_value);
      setShowResults(true);
    } catch (error) {
      console.error('Error al evaluar:', error);
      alert('Ocurrió un error al evaluar los datos. Por favor, verifica los valores ingresados.');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        func_obj_coef_x: inputValues[0],
        func_obj_coef_y: inputValues[1],
        resc1_coef_a: inputValues[2],
        resc1_coef_b: inputValues[3],
        resc1_coef_c: inputValues[4],
        resc2_coef_a: inputValues[5],
        resc2_coef_b: inputValues[6],
        resc2_coef_c: inputValues[7],
        resc3_coef_a: inputValues[8],
        resc3_coef_b: inputValues[9],
        resc3_coef_c: inputValues[10],
        evaluation_point_x: inputValues[11],
        evaluation_point_y: inputValues[12],
      };

      const response = await axios.post('http://localhost:5008/Activity_1/save', payload);
      alert(response.data.message || 'Datos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      if (error.response && error.response.data) {
        alert(`Error al guardar: ${error.response.data.error}`);
      } else {
        alert('Ocurrió un error al guardar los datos.');
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: 'linear-gradient(135deg, #001f3f, #004080)',
        backgroundSize: 'cover',
        color: '#fff',
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
                  textShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
        <div
          className="card border-0 rounded-4 shadow-lg p-4 mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h2
              className="text-primary mb-0 fw-bold"
              style={{
                background: 'linear-gradient(90deg, #0062cc, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,123,255,0.1)',
              }}
            >
              
              Optimización de Dos Variables
            </h2>
            <button
              className="btn btn-outline-secondary px-3 py-2 rounded-pill shadow-sm"
              onClick={onBack}
              style={{ transition: 'all 0.3s ease' }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div
                className="alert"
                style={{
                  background: 'linear-gradient(90deg, #0099ff, #00ccff)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 153, 255, 0.2)',
                }}
              >
                <p className="mb-0 fw-medium">Ingrese los 13 valores numéricos para realizar la optimización.</p>
              </div>

              <div className="mt-4">
                <h4 className="fw-bold mb-3">Parámetros de entrada</h4>

                <div className="row g-3 mb-4">
  {[
    "func_obj_coef_x",
    "func_obj_coef_y",
    "resc1_coef_a",
    "resc1_coef_b",
    "resc1_coef_c",
    "resc2_coef_a",
    "resc2_coef_b",
    "resc2_coef_c",
    "resc3_coef_a",
    "resc3_coef_b",
    "resc3_coef_c",
    "evaluation_point_x",
    "evaluation_point_y",
  ].map((label, index) => (
    <div className="col-md-3" key={index}>
      <div className="form-group">
        <label className="fw-medium mb-1">{label}:</label>
        <input
          type="number"
          className="form-control form-control-lg border-0 shadow-sm"
          style={{
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
            transition: "all 0.3s ease",
          }}
          value={inputValues[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          required
          placeholder="Ingrese un valor"
        />
      </div>
    </div>
  ))}
</div>

                <button
                  className="btn px-4 py-2 shadow"
                  style={{
                    background: allInputsFilled ? 'linear-gradient(90deg, #0062cc, #0099ff)' : '#6c757d',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    opacity: allInputsFilled ? 1 : 0.7,
                  }}
                  disabled={!allInputsFilled}
                  onClick={handleEvaluate}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Evaluar
                </button>
              </div>

              {showResults && (
                <div className="mt-5">
                  <h4 className="fw-bold mb-3">Resultados de la evaluación</h4>

                  <div className="row">
                    <div className="col-md-8 mx-auto mb-3">
                      <div
                        className="card border-0 shadow"
                        style={{ borderRadius: '16px', overflow: 'hidden' }}
                      >
                        <div
                          className="card-header py-3"
                          style={{
                            background: 'linear-gradient(90deg, #0062cc, #0099ff)',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          <h5 className="mb-0 fw-bold">Visualización Gráfica</h5>
                        </div>
                        <div
                          className="card-body p-4 bg-light text-dark"
                          style={{ height: '350px' }}
                        >
                          {graphicResult ? (
                            <img
                              src={`data:image/png;base64,${graphicResult}`}
                              alt="Gráfica generada"
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <p className="text-center text-muted">No se pudo generar la gráfica</p>
                          )}
                        </div>
                      </div>

                      <div
                        className="card border-0 shadow mt-3"
                        style={{ borderRadius: '16px', overflow: 'hidden' }}
                      >
                        <div
                          className="card-header py-3"
                          style={{
                            background: 'linear-gradient(90deg, #0062cc, #0099ff)',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          <h5 className="mb-0 fw-bold">Valor de la función costo</h5>
                        </div>
                        <div className="card-body p-3 bg-light text-dark">
                          <div
                            className="p-3 text-center"
                            style={{
                              background: 'linear-gradient(135deg, #001f3f, #004080)',
                              borderRadius: '8px',
                              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)',
                            }}
                          >
                            <code
                              className="text-light fs-4 d-block"
                              style={{ fontFamily: 'monospace' }}
                            >
                              {costFunctionValue}
                            </code>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          className="btn px-4 py-2 shadow"
                          style={{
                            background: 'linear-gradient(90deg, #198754, #20c997)',
                            color: '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={handleSave}
                        >
                          <i className="bi bi-save me-2"></i>
                          Guardar resultados
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgoritmosOptimizacion;