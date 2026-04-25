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
    let url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(auth),
    };

    if (method === 'GET' && data) {
      const params = new URLSearchParams(data);
      url += `?${params}`;
    } else if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const res = await fetch(url, options);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
      return json;
    } catch (error) {
      console.error(`[API Error] ${method} ${url}:`, error);
      throw error;
    }
  }

  get(endpoint, params = null, auth = true) {
    return this.request('GET', endpoint, params, auth);
  }

  // FIX: Change auth default from false to true
  post(endpoint, data, auth = true) {
    return this.request('POST', endpoint, data, auth);
  }

  put(endpoint, data, auth = true) {
    return this.request('PUT', endpoint, data, auth);
  }

  delete(endpoint, auth = true) {
    return this.request('DELETE', endpoint, null, auth);
  }

  // Add patch for order status updates
  patch(endpoint, data, auth = true) {
    return this.request('PATCH', endpoint, data, auth);
  }
}

export const authApi = new ApiClient(API_BASE.auth);
export const restaurantApi = new ApiClient(API_BASE.restaurants);
export const menuApi = new ApiClient(API_BASE.menu);
export const orderApi = new ApiClient(API_BASE.orders);

export const authAPI = authApi;
export const restaurantAPI = restaurantApi;
export const menuAPI = menuApi;
export const orderAPI = orderApi;

export default {
  auth: authApi,
  restaurant: restaurantApi,
  menu: menuApi,
  order: orderApi,
};