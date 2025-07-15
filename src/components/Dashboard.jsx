import React, { useEffect, useState } from 'react';
import { getDatabase } from '../db/db';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    depots: 0,
    retraits: 0,
    commissions: [0, 0, 0],
    loading: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const db = await getDatabase();
      const users = db.exec(`SELECT COUNT(*) as total FROM utilisateurs`)[0]?.values[0][0] || 0;
      const depots = db.exec(`SELECT SUM(montant) FROM depot`)[0]?.values[0][0] || 0;
      const retraits = db.exec(`SELECT SUM(montant) FROM retraits`)[0]?.values[0][0] || 0;
      const levels = [1, 2, 3].map(n => 
        db.exec(`SELECT SUM(montant) FROM commissions WHERE niveau = ${n}`)[0]?.values[0][0] || 0
      );
      
      setStats({ users, depots, retraits, commissions: levels, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const commissionsData = {
    labels: ['Niveau 1', 'Niveau 2', 'Niveau 3'],
    datasets: [{
      label: 'Commissions par niveau',
      data: stats.commissions,
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgba(139, 92, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const doughnutData = {
    labels: ['Dépôts', 'Retraits'],
    datasets: [{
      data: [stats.depots, stats.retraits],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(139, 92, 246, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Répartition des Commissions',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  if (stats.loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de Bord</h1>
        <p className="dashboard-subtitle">Vue d'ensemble des performances</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.users.toLocaleString()}</h3>
            <p className="stat-label">Utilisateurs</p>
          </div>
          <div className="stat-trend positive">+12%</div>
        </div>

        <div className="stat-card deposits">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-value">{formatCurrency(stats.depots)}</h3>
            <p className="stat-label">Dépôts</p>
          </div>
          <div className="stat-trend positive">+8%</div>
        </div>

        <div className="stat-card withdrawals">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3 className="stat-value">{formatCurrency(stats.retraits)}</h3>
            <p className="stat-label">Retraits</p>
          </div>
          <div className="stat-trend negative">-3%</div>
        </div>

        <div className="stat-card commissions">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-value">{formatCurrency(stats.commissions.reduce((a, b) => a + b, 0))}</h3>
            <p className="stat-label">Commissions</p>
          </div>
          <div className="stat-trend positive">+15%</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Commissions par Niveau</h3>
          </div>
          <div className="chart-content">
            <Bar data={commissionsData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Répartition Dépôts/Retraits</h3>
          </div>
          <div className="chart-content">
            <Doughnut data={doughnutData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Activité Récente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p>Nouveau dépôt de 50,000 FCFA</p>
              <span className="activity-time">Il y a 2 minutes</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <p>Commission de niveau 2 générée</p>
              <span className="activity-time">Il y a 15 minutes</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p>Nouvel utilisateur inscrit</p>
              <span className="activity-time">Il y a 1 heure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}