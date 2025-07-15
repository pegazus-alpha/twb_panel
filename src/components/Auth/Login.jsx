// src/components/Login.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser l'erreur lors de la saisie
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError("Le mot de passe est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Simulation d'une requête async
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (formData.password === "admin") {
        onLogin();
      } else {
        setError("Mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Styles inline
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: '3rem 1rem'
  };

  const cardStyle = {
    maxWidth: '28rem',
    width: '100%',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '1.875rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '2rem'
  };

  const formStyle = {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#111827',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
  };

  const inputFocusStyle = {
    borderColor: '#8b5cf6',
    boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
  };

  const errorStyle = {
    borderRadius: '0.375rem',
    backgroundColor: '#fef2f2',
    padding: '1rem',
    border: '1px solid #fecaca'
  };

  const errorTextStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#dc2626'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    backgroundColor: isLoading ? '#9ca3af' : '#8b5cf6',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    outline: 'none'
  };

  const buttonHoverStyle = {
    backgroundColor: '#7c3aed'
  };

  const spinnerStyle = {
    width: '1rem',
    height: '1rem',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
    display: 'block'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div>
            <h2 style={titleStyle}>
              Connexion Admin
            </h2>
          </div>
          
          <form style={formStyle} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" style={labelStyle}>
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Mot de passe"
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.borderColor = inputFocusStyle.borderColor;
                  e.target.style.boxShadow = inputFocusStyle.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div style={errorStyle}>
                <div>
                  <h3 style={errorTextStyle}>
                    {error}
                  </h3>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#8b5cf6';
                  }
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={spinnerStyle}></div>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;