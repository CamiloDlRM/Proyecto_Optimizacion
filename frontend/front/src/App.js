import React, { useState } from "react";
import Login from "./Login";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onLoginSuccess={() => setCurrentPage("home")} />;
      case "home":
        return <h1>Bienvenido a la página principal</h1>;
      default:
        return <h1>Página no encontrada</h1>;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;