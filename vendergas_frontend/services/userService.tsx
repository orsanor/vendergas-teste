const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchUsers() {
  const res = await fetch(`${baseUrl}/api/users`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return await res.json();
}
