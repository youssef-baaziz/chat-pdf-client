/* import { HTTP } from "@/lib/axios";
  
  export default {
    namespaced: true,
    state: {
      authenticated: false,
      user: {},
    },
    getters: {
      authenticated(state) {
        return state.authenticated
      },
      user(state) {
        return state.user
      },
    },
    mutations: {
      SET_AUTHENTICATED(state, value) {
        state.authenticated = value
      },
      SET_USER(state, value) {
        state.user = value
      },
    },
    actions: {
      async signIn({
        commit
      }, credentials) {
        // await HTTP.get('/sanctum/csrf-cookie')
        return await HTTP.post('login', credentials).then((response) => {
          localStorage.setItem('token', response.data)
        });
      },
  
      async signOut({
        commit
      }) {
        await HTTP.post('/logout')
        localStorage.removeItem('token');
        commit('SET_AUTHENTICATED', false)
        commit('SET_USER', null)
      },
      async getUser({ commit }, credentials) {
        return await HTTP.post('user', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          commit('SET_AUTHENTICATED', true);
          commit('SET_USER', response.data);
        })
        .catch(() => {
          commit('SET_AUTHENTICATED', false);
          commit('SET_USER', null);
        });0
      }
      
    }
  }
   */

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
        const token = response.data.access_token;

        // Store the token in local storage and update the state
        localStorage.setItem('authToken', token);
        commit('SET_TOKEN', token);
        commit('SET_AUTHENTICATED', true);

        // Attach the token to all HTTP requests
        HTTP.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
