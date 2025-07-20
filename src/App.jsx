import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, DollarSign, Award, User, AlertCircle, Search, Filter, ArrowUpDown, Edit, Trash2, Ban, CheckCircle, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

// Service API avec gestion d'erreurs améliorée
const apiService = {
  fetchWithErrorHandling: async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de l'appel API ${url}:`, error);
      throw error;
    }
  },

  fetchUtilisateurs: () => apiService.fetchWithErrorHandling(`${API_BASE_URL}/utilisateurs`),
  fetchUtilisateur: (id) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/utilisateurs/${id}`),
  fetchRetraits: () => apiService.fetchWithErrorHandling(`${API_BASE_URL}/retraits`),
  fetchRetraitsUser: (userId) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/retraits/user/${userId}`),
  fetchDepot: () => apiService.fetchWithErrorHandling(`${API_BASE_URL}/depot`),
  fetchDepotUser: (userId) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/depot/user/${userId}`),
  fetchCommissions: () => apiService.fetchWithErrorHandling(`${API_BASE_URL}/commissions`),
  fetchCommissionsUser: (userId) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/commissions/user/${userId}`),
  fetchStats: () => apiService.fetchWithErrorHandling(`${API_BASE_URL}/stats`),
  fetchHierarchy: (userId) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/hierarchy/${userId}`),

  deleteUser: (id) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/utilisateurs/${id}`, { method: 'DELETE' }),
  updateUserStatus: (id, statut) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/utilisateurs/${id}/statut`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statut })
  }),
  updateUser: (id, userData) => apiService.fetchWithErrorHandling(`${API_BASE_URL}/utilisateurs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
};

// Composant d'erreur
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
      <div>
        <h3 className="text-sm font-medium text-red-800">Erreur</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
      >
        Réessayer
      </button>
    )}
  </div>
);

// Composant Modal
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Composant de filtrage et recherche
const FilterBar = ({ searchTerm, onSearchChange, sortBy, onSortChange, filterBy, onFilterChange, data = [], type = 'utilisateurs' }) => {
  const getSortOptions = () => {
    switch (type) {
      case 'utilisateurs':
        return [
          { value: 'nom', label: 'Nom' },
          { value: 'date_enregistrement', label: 'Date d\'enregistrement' },
          { value: 'montant_depot', label: 'Montant dépôt' },
          { value: 'benefice_total', label: 'Bénéfice total' }
        ];
      case 'retraits':
        return [
          { value: 'date_retrait', label: 'Date de retrait' },
          { value: 'montant', label: 'Montant' },
          { value: 'nom', label: 'Nom utilisateur' }
        ];
      case 'depot':
        return [
          { value: 'date_depot', label: 'Date de dépôt' },
          { value: 'montant', label: 'Montant' },
          { value: 'nom', label: 'Nom utilisateur' }
        ];
      case 'commissions':
        return [
          { value: 'date', label: 'Date' },
          { value: 'montant', label: 'Montant' },
          { value: 'niveau', label: 'Niveau' }
        ];
      default:
        return [];
    }
  };

  const getFilterOptions = () => {
    switch (type) {
      case 'utilisateurs':
        return [
          { value: 'all', label: 'Tous les statuts' },
          { value: 'actif', label: 'Actifs' },
          { value: 'bloque', label: 'Bloqués' },
          { value: 'inactif', label: 'Inactifs' }
        ];
      default:
        return [{ value: 'all', label: 'Tous' }];
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Trier par...</option>
            {getSortOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {getFilterOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour formater les montants
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '0.00';
  return Number(amount).toFixed(2);
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Date invalide';
  }
};

// Composant principal
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [data, setData] = useState({
    utilisateurs: [],
    retraits: [],
    depot: [],
    commissions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // États pour les modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const tabs = [
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'retraits', label: 'Retraits', icon: TrendingDown },
    { id: 'depot', label: 'Dépôts', icon: TrendingUp },
    { id: 'commissions', label: 'Commissions', icon: Award },
    { id: 'stats', label: 'Statistiques', icon: DollarSign }
  ];

  // Fonctions de filtrage et tri
  const filterAndSortData = (dataArray, type) => {
    let filtered = dataArray;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const searchFields = type === 'utilisateurs'
          ? [item.nom, item.user_id, item.langue, item.adresse_wallet]
          : type === 'retraits' || type === 'depot'
            ? [item.nom, item.username, item.user_id, item.adresse]
            : [item.parrain_nom, item.filleul_nom, item.user_id, item.filleul_id];

        return searchFields.some(field =>
          field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtrage par statut (pour les utilisateurs)
    if (type === 'utilisateurs' && filterBy !== 'all') {
      filtered = filtered.filter(item => item.statut === filterBy);
    }

    // Tri
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy.includes('date')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (sortBy.includes('montant') || sortBy === 'benefice_total') {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        }

        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });
    }

    return filtered;
  };

  // Charger les données avec gestion d'erreur
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [utilisateurs, retraits, depot, commissions, statsData] = await Promise.all([
        apiService.fetchUtilisateurs().catch(err => {
          console.error('Erreur utilisateurs:', err);
          return [];
        }),
        apiService.fetchRetraits().catch(err => {
          console.error('Erreur retraits:', err);
          return [];
        }),
        apiService.fetchDepot().catch(err => {
          console.error('Erreur dépôts:', err);
          return [];
        }),
        apiService.fetchCommissions().catch(err => {
          console.error('Erreur commissions:', err);
          return [];
        }),
        apiService.fetchStats().catch(err => {
          console.error('Erreur stats:', err);
          return {};
        })
      ]);

      setData({
        utilisateurs: utilisateurs || [],
        retraits: retraits || [],
        depot: depot || [],
        commissions: commissions || []
      });

      setStats(statsData || {});
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Impossible de charger les données. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de gestion des utilisateurs
  const handleDeleteUser = async (userId) => {
    try {
      await apiService.deleteUser(userId);
      setData(prev => ({
        ...prev,
        utilisateurs: prev.utilisateurs.filter(user => user.user_id !== userId)
      }));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
  try {
    await apiService.updateUserStatus(userId, newStatus);
    setData(prev => ({
      ...prev,
      utilisateurs: prev.utilisateurs.map(user =>
        user.user_id === userId ? { ...user, statut: newStatus } : user
      )
    }));
  } catch (error) {
    console.error('Erreur:', error);
    setError('Erreur lors de la mise à jour du statut');
  }
};

const handleUpdateUser = async (userData) => {
  try {
    await apiService.updateUser(editingUser.user_id, userData);
    setData(prev => ({
      ...prev,
      utilisateurs: prev.utilisateurs.map(user =>
        user.user_id === editingUser.user_id ? { ...user, ...userData } : user
      )
    }));
    setIsEditModalOpen(false);
    setEditingUser(null);
  } catch (error) {
    console.error('Erreur:', error);
    setError('Erreur lors de la mise à jour de l\'utilisateur');
  }
};

useEffect(() => {
  loadData();
}, []);

// Formulaire d'édition d'utilisateur
const UserEditForm = () => {
  const [formData, setFormData] = useState({
    nom: editingUser?.nom || '',
    langue: editingUser?.langue || '',
    montant_depot: editingUser?.montant_depot || '',
    benefice_total: editingUser?.benefice_total || '',
    commissions_totales: editingUser?.commissions_totales || '',
    adresse_wallet: editingUser?.adresse_wallet || '',
    cycle: editingUser?.cycle || '',
    statut: editingUser?.statut || '',
    date_enregistrement: editingUser?.date_enregistrement || '',
    date_mise_a_jour: editingUser?.date_mise_a_jour || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateUser(formData);
  };

  return (
    <div className="max-h-96 overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
          <select
            value={formData.langue}
            onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant du dépôt</label>
          <input
            type="number"
            value={formData.montant_depot}
            onChange={(e) => setFormData({ ...formData, montant_depot: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bénéfice total</label>
          <input
            type="number"
            value={formData.benefice_total}
            onChange={(e) => setFormData({ ...formData, benefice_total: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commissions totales</label>
          <input
            type="number"
            value={formData.commissions_totales}
            onChange={(e) => setFormData({ ...formData, commissions_totales: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de wallet</label>
          <input
            type="text"
            value={formData.adresse_wallet}
            onChange={(e) => setFormData({ ...formData, adresse_wallet: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cycle</label>
          <input
            type="number"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'enregistrement</label>
          <input
            type="text"
            value={formData.date_enregistrement}
            onChange={(e) => setFormData({ ...formData, date_enregistrement: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de mise à jour</label>
          <input
            type="text"
            value={formData.date_mise_a_jour}
            onChange={(e) => setFormData({ ...formData, date_mise_a_jour: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};
  // Composant pour afficher les utilisateurs
  const UtilisateursTab = () => {
    const filteredUsers = filterAndSortData(data.utilisateurs, 'utilisateurs');

    return (
      <div className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          data={data.utilisateurs}
          type="utilisateurs"
        />

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <div key={user.user_id} className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">{user.nom || 'Nom non défini'}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${user.statut === 'actif' ? 'bg-green-100 text-green-800' :
                      user.statut === 'bloque' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.statut || 'inconnu'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono">{user.user_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Enregistrement:</span>
                    <span className="font-mono">{user.date_enregistrement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dépôt:</span>
                    <span className="font-semibold">{formatAmount(user.montant_depot)} $</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bénéfice:</span>
                    <span className="font-semibold text-green-600">{formatAmount(user.benefice_total)} $</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commissions:</span>
                    <span className="font-semibold">{user.commissions_totales || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Langue:</span>
                    <span className="uppercase">{user.langue || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière mise à jour:</span>
                    <span className="font-mono">{user.date_mise_a_jour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycles:</span>
                    <span className="font-mono">{user.cycle}/8</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </button>

                  <button
                    onClick={() => handleUpdateUserStatus(user.user_id, user.statut === 'actif' ? 'bloque' : 'actif')}
                    className={`flex-1 py-2 px-2 rounded transition-colors flex items-center justify-center ${user.statut === 'actif'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                  >
                    {user.statut === 'actif' ? (
                      <>
                        <Ban className="h-4 w-4 mr-1" />
                        Bloquer
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activer
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Composant pour afficher les retraits
  const RetraitsTab = () => {
    const filteredRetraits = filterAndSortData(data.retraits, 'retraits');

    return (
      <div className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          data={data.retraits}
          type="retraits"
        />

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réseau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRetraits.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucun retrait trouvé
                    </td>
                  </tr>
                ) : (
                  filteredRetraits.map(retrait => (
                    <tr key={retrait.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{retrait.nom || retrait.username || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {retrait.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-red-600">{formatAmount(retrait.montant)} $</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{retrait.reseau || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(retrait.date_retrait)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-500">
                          {retrait.adresse ? `${retrait.adresse.substring(0, 20)}...` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour afficher les dépôts
  const DepotTab = () => {
    const filteredDepots = filterAndSortData(data.depot, 'depot');

    return (
      <div className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          data={data.depot}
          type="depot"
        />

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réseau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepots.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucun dépôt trouvé
                    </td>
                  </tr>
                ) : (
                  filteredDepots.map(depot => (
                    <tr key={depot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{depot.nom || depot.username || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {depot.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">{formatAmount(depot.montant)} $</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{depot.reseau || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(depot.date_depot)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-500">
                          {depot.adresse ? `${depot.adresse.substring(0, 20)}...` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour afficher les commissions
  const CommissionsTab = () => {
    const filteredCommissions = filterAndSortData(data.commissions, 'commissions');

    return (
      <div className="space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          data={data.commissions}
          type="commissions"
        />

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parrain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filleul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucune commission trouvée
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((commission, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.parrain_nom || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {commission.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.filleul_nom || 'N/A'}</div>
                        <div className="text-sm text-gray-500">ID: {commission.filleul_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-blue-600">{formatAmount(commission.montant)} $</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Niveau {commission.niveau}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(commission.date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour afficher les statistiques
  const StatsTab = () => {
    const statCards = [
      {
        title: 'Total Utilisateurs',
        value: stats.totalUsers?.count || 0,
        icon: Users,
        color: 'bg-blue-500'
      },
      {
        title: 'Total Dépôts',
        value: `${formatAmount(stats.totalDeposits?.total || 0)} $`,
        icon: TrendingUp,
        color: 'bg-green-500'
      },
      {
        title: 'Total Retraits',
        value: `${formatAmount(stats.totalWithdrawals?.total || 0)} $`,
        icon: TrendingDown,
        color: 'bg-red-500'
      },
      {
        title: 'Total Commissions',
        value: `${formatAmount(stats.totalCommissions?.total || 0)} $`,
        icon: Award,
        color: 'bg-purple-500'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Répartition des utilisateurs par statut</h3>
            <div className="space-y-3">
              {['actif', 'bloque', 'inconnu'].map(status => {
                const count = data.utilisateurs.filter(u => u.statut === status).length;
                const percentage = data.utilisateurs.length > 0 ? (count / data.utilisateurs.length * 100).toFixed(1) : 0;

                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize">{status}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${status === 'actif' ? 'bg-green-500' :
                              status === 'bloque' ? 'bg-red-500' : 'bg-gray-500'
                            }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Nouveaux utilisateurs (30j)</span>
                <span className="font-semibold">
                  {data.utilisateurs.filter(u => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(u.date_enregistrement) > thirtyDaysAgo;
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Retraits (7j)</span>
                <span className="font-semibold">
                  {data.retraits.filter(r => {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return new Date(r.date_retrait) > sevenDaysAgo;
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Dépôts (7j)</span>
                <span className="font-semibold">
                  {data.depot.filter(d => {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return new Date(d.date_depot) > sevenDaysAgo;
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu du composant principal
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'utilisateurs':
        return <UtilisateursTab />;
      case 'retraits':
        return <RetraitsTab />;
      case 'depot':
        return <DepotTab />;
      case 'commissions':
        return <CommissionsTab />;
      case 'stats':
        return <StatsTab />;
      default:
        return <UtilisateursTab />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <button
              onClick={loadData}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                  setSortBy('');
                  setFilterBy('all');
                }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => {
              setError(null);
              loadData();
            }}
          />
        )}

        {renderActiveTab()}
      </div>

      {/* Modales */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier l'utilisateur"
      >
        <UserEditForm />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
      >
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.nom}</strong> ?
            Cette action est irréversible.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => handleDeleteUser(userToDelete.user_id)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;