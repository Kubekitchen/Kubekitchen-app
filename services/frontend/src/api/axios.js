// Exports both naming conventions to avoid breaking existing imports
const API_BASE = {
  auth: '/api/auth',
  restaurants: '/api/restaurants',
  menu: '/api/menu',
  orders: '/api/orders',
};

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(method, endpoint, data = null, auth = true) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(auth),
    };
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(url, options);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || json.error || `HTTP ${res.status}`);
    }
    return json;
  }

  get(endpoint, auth = true) { return this.request('GET', endpoint, null, auth); }
  post(endpoint, data, auth = false) { return this.request('POST', endpoint, data, auth); }
  put(endpoint, data, auth = true) { return this.request('PUT', endpoint, data, auth); }
  delete(endpoint, auth = true) { return this.request('DELETE', endpoint, null, auth); }
}

// lowercase exports (new standard)
export const authApi = new ApiClient(API_BASE.auth);
export const restaurantApi = new ApiClient(API_BASE.restaurants);
export const menuApi = new ApiClient(API_BASE.menu);
export const orderApi = new ApiClient(API_BASE.orders);

// UPPERCASE aliases - for any existing files that import authAPI, restaurantAPI etc.
export const authAPI = authApi;
export const restaurantAPI = restaurantApi;
export const menuAPI = menuApi;
export const orderAPI = orderApi;

// Default export as object - covers any other import pattern
export default {
  auth: authApi,
  restaurant: restaurantApi,
  menu: menuApi,
  order: orderApi,
};