const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Une erreur est survenue')
  }

  return res.json()
}

export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: data }),
  login: (data) => api('/auth/login', { method: 'POST', body: data }),
  demo: () => api('/auth/demo', { method: 'POST' }),
  me: () => api('/auth/me'),
  updateMe: (data) => api('/auth/me', { method: 'PATCH', body: data }),
}

export const clientsApi = {
  list: (search) => api(`/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data) => api('/clients', { method: 'POST', body: data }),
  update: (id, data) => api(`/clients/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => api(`/clients/${id}`, { method: 'DELETE' }),
}

export const salesApi = {
  list: (period) => api(`/sales${period ? `?period=${period}` : ''}`),
  create: (data) => api('/sales', { method: 'POST', body: data }),
  delete: (id) => api(`/sales/${id}`, { method: 'DELETE' }),
}

export const statsApi = {
  get: () => api('/stats'),
}

export const chatApi = {
  list: () => api('/chat'),
  send: (content) => api('/chat', { method: 'POST', body: { content } }),
  clear: () => api('/chat', { method: 'DELETE' }),
}
