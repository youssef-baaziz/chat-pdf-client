<template>joôj
  <div id="app" class="d-flex scroll">
    <Sidebar ref="sidebarRef" />
    <div class="flex-grow-1">
      <Header />
      <ChatVide v-if="chatVide" />
      <ChatWindow v-else />
      <inputChat v-if="session.messages.length > 0" />
        <p v-if="countdown > 0">Reconnect in {{ countdown }} seconds.</p>
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Your session has expired</h2>
          <p>Please log in again to continue using the app.</p>
          <p v-if="countdown > 0">Reconnect in {{ countdown }} seconds.</p>
          <button @click="redirectToLogin">Reconnect Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import ChatWindow from '../components/MessageList.vue';
import ChatVide from '../components/MessageVide.vue';
import inputChat from '../components/UserInput.vue';
import { useStore } from 'vuex';
import jwt_decode from 'jwt-decode';

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    ChatWindow,
    ChatVide,
    inputChat
  },
  data() {
    return {
      openSideBar: true,
      showModal: false,
      token: localStorage.getItem('access_token'), // Token from localStorage
      timer: null,
      countdown: 120, // Countdown starts at 120 seconds (2 minutes)
    };
  },
  methods: {
    updateStyle() {
      if (window.innerWidth <= 755 || !this.openSideBar) {
        this.store.dispatch('setShowSide', false);
      } else {
        this.store.dispatch('setShowSide', true);
      }
    },
    redirectToLogin() {
      localStorage.removeItem('access_token');
      this.$router.push('/login'); // Adjust if you are using a different router
    },
    checkTokenExpiration() {
      if (this.token) {
        const decoded = jwt_decode(this.token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        // If the token is expired, show modal
        if (decoded.exp < currentTime) {
          this.showModal = true; // Show modal
          clearInterval(this.timer); // Stop checking
          this.startCountdown(); // Start the countdown
        }
      } else {
        this.showModal = true; // Show modal if no token
      }
    },
    startCountdown() {
      this.countdown = 120; // Reset countdown to 120 seconds
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer); // Clear the interval when countdown reaches 0
          this.redirectToLogin(); // Redirect to login automatically after countdown
        }
      }, 1000); // Update countdown every second
    },
  },
  computed: {
    store() {
      return useStore();
    },
    showSidebar() {
      return this.store.state.showSidebar;
    },
    chatVide() {
      return this.store.state.chatVide;
    },
    session() {
      const store = useStore();
      const sessions = store.state.sessions;
      const currentSessionId = store.state.currentSessionId;
      return sessions.find((session) => session.id === currentSessionId);
    },
  },
  mounted() {
    this.store.dispatch('setChatVide', true);
    this.checkTokenExpiration();

    // Periodically check for token expiration every minute
    this.timer = setInterval(() => {
      this.checkTokenExpiration();
    }, 60000); // Check every 60 seconds
  },
  created() {
    this.$store.dispatch("initData");
    window.addEventListener('resize', this.updateStyle);
    this.updateStyle();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.updateStyle);
  },
};
</script>

<style scoped>
#app {
  height: 100vh;
  overflow: hidden;
}

.scroll {
  overflow-y: auto;
  height: 800px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
