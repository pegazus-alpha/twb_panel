import React, { useEffect, useState } from 'react';
import { getDatabase } from '../db/db';

export default function TableTemplate({ table, fields, title }) {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [query, setQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [table]);

  useEffect(() => {
    filterData();
  }, [rows, query]);

  async function loadData() {
    try {
      setLoading(true);
      const db = await getDatabase();
      const results = db.exec(`SELECT * FROM ${table}`);
      const data = results[0]?.values || [];
      setRows(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  }

  function filterData() {
    if (!query) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter(row =>
      row.some(cell => 
        cell?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredRows(filtered);
    setCurrentPage(1);
  }

  function handleSort(columnIndex) {
    let direction = 'asc';
    if (sortConfig.key === columnIndex && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedRows = [...filteredRows].sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRows(sortedRows);
    setSortConfig({ key: columnIndex, direction });
  }

  function exportToCSV() {
    const csvContent = [
      fields.join(','),
      ...filteredRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${table}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const formatCellValue = (value, fieldName) => {
    if (fieldName?.includes('montant') || fieldName?.includes('benefice')) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
      }).format(value);
    }
    if (fieldName?.includes('date')) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    return value;
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title-section">
          <h2 className="table-title">{title || table}</h2>
          <p className="table-subtitle">{filteredRows.length} enregistrements</p>
        </div>
        
        <div className="table-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <button onClick={exportToCSV} className="btn-export">
            <span className="export-icon">📥</span>
            Exporter
          </button>
          
          <button onClick={loadData} className="btn-refresh">
            <span className="refresh-icon">🔄</span>
            Actualiser
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {fields.map((field, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`table-header-cell ${sortConfig.key === index ? 'sorted' : ''}`}
                >
                  <div className="header-content">
                    <span>{field}</span>
                    <span className="sort-indicator">
                      {sortConfig.key === index ? (
                        sortConfig.direction === 'asc' ? '▲' : '▼'
                      ) : '↕️'}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="table-cell">
                    {formatCellValue(cell, fields[cellIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRows.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Aucune donnée trouvée</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Précédent
          </button>
          
          <div className="pagination-info">
            Page {currentPage} sur {totalPages}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}