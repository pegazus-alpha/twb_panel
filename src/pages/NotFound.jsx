import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl mb-4">Page non trouvée</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Retour au tableau de bord
      </Link>
    </div>
  );
};

export default NotFound;
