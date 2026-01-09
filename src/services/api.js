export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 401) return refreshAndRetry(url, options);

  return res;
}

async function refreshAndRetry(url, options) {
  const refresh = localStorage.getItem("refresh");

  const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/refresh/", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ refresh })
  });

  if (!res.ok) logout();

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return apiFetch(url, options);
}

export function logout() {
  localStorage.clear();
  window.location.href = "/signin";
}
