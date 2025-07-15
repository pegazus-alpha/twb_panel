import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Bienvenue sur le panneau d'administration</h1>
      <p className="mb-4">
        Utilisez le menu à gauche pour naviguer entre les fonctionnalités :
        utilisateurs, dépôts, retraits, commissions, etc.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/utilisateurs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
          👥 Gérer les utilisateurs
        </Link>
        <Link to="/depot" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center">
          💰 Voir les dépôts
        </Link>
        <Link to="/retraits" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center">
          🏧 Suivi des retraits
        </Link>
        <Link to="/commissions" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center">
          🎯 Statistiques commissions
        </Link>
      </div>
    </div>
  );
};

export default Home;
