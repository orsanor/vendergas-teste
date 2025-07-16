export async function fetchUsers() {
  const res = await fetch("http://localhost:3000/api/users", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return await res.json();
}
