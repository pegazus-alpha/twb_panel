import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminRoles() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: "", role: "moderator" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const res = await axios.get("/api/admin/users");
    setAdmins(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await axios.post("/api/admin/users", form);
    fetchAdmins();
    setForm({ username: "", role: "moderator" });
  };

  const handleDelete = async (username) => {
    await axios.delete(`/api/admin/users/${username}`);
    fetchAdmins();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Gestion des administrateurs</h2>
      <div className="mb-4">
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border mr-2 p-1" />
        <select name="role" value={form.role} onChange={handleChange} className="border p-1 mr-2">
          <option value="moderator">Modérateur</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1">Ajouter</button>
      </div>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-1">Username</th>
            <th className="border p-1">Rôle</th>
            <th className="border p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.username}>
              <td className="border p-1">{a.username}</td>
              <td className="border p-1">{a.role}</td>
              <td className="border p-1">
                <button onClick={() => handleDelete(a.username)} className="text-red-600">🗑️ Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
