"use client"

import { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching users...");
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Erro: {error}</p>;
  if (!users.length) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Lista de Usuários</h1>
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} ({user.email})
        </li>
      ))}
    </ul>
      </div>
  );
}
