
import React from 'react';
import Login from '../components/Auth/Login';

export default function LoginPage({ onLogin }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Login onLogin={onLogin} />
    </div>
  );
}
