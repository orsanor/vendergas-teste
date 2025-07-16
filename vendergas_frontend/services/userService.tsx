export async function fetchUsers() {
  const res = await fetch(`/api/users`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return await res.json();
}
