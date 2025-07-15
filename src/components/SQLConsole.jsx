import React, { useState } from "react";
import axios from "axios";

export default function SQLConsole() {
  const [query, setQuery] = useState("SELECT * FROM utilisateurs LIMIT 10;");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const runQuery = async () => {
    try {
      const res = await axios.post("/api/admin/sql", { query });
      setResults(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur SQL");
      setResults([]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Console SQL</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 mb-2"
        rows={4}
      />
      <button onClick={runQuery} className="bg-blue-600 text-white px-4 py-2 rounded">
        Exécuter
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {results.length > 0 && (
        <table className="table-auto w-full mt-4 border">
          <thead>
            <tr>
              {Object.keys(results[0]).map((key) => (
                <th key={key} className="border px-2 py-1">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="border px-2 py-1">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
