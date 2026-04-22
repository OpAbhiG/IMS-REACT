import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'   // your Express server
})

export const inventoryAPI = {
  getAll: () => api.get('/items'),
  add: (item) => api.post('/items', item),
  update: (id, item) => api.put(`/items/${id}`, item),
  delete: (id) => api.delete(`/items/${id}`),
  // add relocate, history, etc.
}

export default api