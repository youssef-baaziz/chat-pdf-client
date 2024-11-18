import { HTTP } from "@/lib/axios";

export default {
  namespaced: true,
  state: {
    authenticated: !!localStorage.getItem('authToken'), // Set initial authentication state based on local storage
    user: {},
    token: localStorage.getItem('authToken') || null,
  },
  getters: {
    authenticated(state) {
      return state.authenticated;
    },
    user(state) {
      return state.user;
    },
    token(state) {
      return state.token;
    },
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value;
    },
    SET_USER(state, value) {
      state.user = value;
    },
    SET_TOKEN(state, value) {
      state.token = value;
    },
  },
  actions: {
    async signIn({ commit }, credentials) {
      try {
        const response = await HTTP.post('login', credentials);
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;

        localStorage.setItem('authToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        commit('SET_TOKEN', access_token);
        commit('SET_AUTHENTICATED', true);

        // Attach the token to all HTTP requests
        HTTP.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return response;
      } catch (error) {
        commit('SET_AUTHENTICATED', false);
        commit('SET_TOKEN', null);
        localStorage.removeItem('authToken'); // Remove any existing token on error
        throw error; // Pass error to the component for handling
      }
    },

    async signOut({ commit }) {
      try {
        // Clear the token from state and local storage
        commit('SET_AUTHENTICATED', false);
        commit('SET_USER', null);
        commit('SET_TOKEN', null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        

        // Remove the token from the default headers
        delete HTTP.defaults.headers.common['Authorization'];
      } catch (error) {
        console.error('Logout failed', error);
      }
    },

    async getUser({ commit }) {
      try {
        const response = await HTTP.get('user'); // Assuming the token is already set in headers
        commit('SET_USER', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        commit('SET_AUTHENTICATED', true);
      } catch (error) {
        commit('SET_AUTHENTICATED', false);
        localStorage.removeItem('user');
        console.error('Error fetching user data', error);
      }
    },
  },
};
