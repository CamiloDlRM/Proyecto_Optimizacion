import React, { useState } from "react";
import Login from "./Login";
import MainPage from "./MainPage";
import OptimizacionDosVariables from "./componentes/OptimizacionDosVariables";
import MatricesSparse from "./componentes/MatricesSparse";
import SeriesTaylor from "./componentes/SeriesTaylor";
import AlgoritmosOptimizacion from "./componentes/AlgoritmosOptimizacion";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [activeProblem, setActiveProblem] = useState(null);

  const renderPage = () => {
    // Primero verificamos si estamos en login
    if (currentPage === "login") {
      return <Login onLoginSuccess={() => setCurrentPage("home")} />;
    }
    
    // Si estamos en home pero hay un problema activo, mostramos ese problema
    if (currentPage === "home" && activeProblem) {
      switch (activeProblem) {
        case "problem1":
          return <OptimizacionDosVariables onBack={() => setActiveProblem(null)} />;
        case "problem2":
          return <MatricesSparse onBack={() => setActiveProblem(null)} />;
        case "problem3":
          return <SeriesTaylor onBack={() => setActiveProblem(null)} />;
        case "problem4":
          return <AlgoritmosOptimizacion onBack={() => setActiveProblem(null)} />;
        default:
          return null;
      }
    }
    
    // Si estamos en home y no hay problema activo, mostramos la página principal
    if (currentPage === "home") {
      return (
        <MainPage 
          onLogout={() => setCurrentPage("login")} 
          onSelectProblem={(problemId) => setActiveProblem(problemId)}
        />
      );
    }
    
    // Fallback
    return <h1>Página no encontrada</h1>;
  };

  return <div>{renderPage()}</div>;
}

export default App;