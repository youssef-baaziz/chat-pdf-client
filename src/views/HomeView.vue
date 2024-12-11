<template>
  <div id="app" class="d-flex scroll">
    <Sidebar ref="sidebarRef" />
    <div class="flex-grow-1">
      <Header />
      <ChatVide v-if="showNewConversation==false" ref="messageVideRef"/>
      <ChatWindow v-if="showNewConversation"/>
      <inputChat v-if="showNewConversation && !isTreatedFile" class="input-chat"/>
      <div v-if="showNewConversation && isTreatedFile">
        <div class=" text-center mb-2" style="color: darkslategrey;">
          <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" class="col mr-3" />
            <span class="font-weight-bold">En cours de traitement du fichier(s)...</span>
        </div>
      </div>
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Votre session a expiré</h2>
          <p>Veuillez vous reconnecter pour continuer à utiliser l’application.</p>
          <div @click="redirectToLogin()" class="btn btn-sm btn-dark text-white btn-connect">Reconnecter</div>
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
import ProgressSpinner from 'primevue/progressspinner';
import { useStore } from "vuex";

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    ChatWindow,
    ChatVide,
    inputChat,
    "ProgressSpinner": ProgressSpinner
  },
  data() {
    return {
      openSideBar: true,
    };
  },
  computed: {
    store() {
      return useStore();
    },
    showSidebar() {
      return this.store.state.showSidebar;
    },
    showModal() {
      return this.store.state.activeComponent;
    },
    session() {
      const store = useStore();
      const sessions = store.state.sessions;
      const currentSessionId = store.state.currentSessionId;
      return sessions.find((session) => session.id === currentSessionId);
    },
    showNewConversation() {
      return this.store.state.showNewConversation;
    },
    isTreatedFile() {
      return this.store.state.isTreatedFile;
    },
  },
  methods: {
    async redirectToLogin() {
      await this.$store.dispatch('auth/signOut');
      this.$router.push({ name: 'login' });
      this.$store.dispatch('setActiveComponent',false);
    },
    updateStyle() {
      if (window.innerWidth <= 1300 || !this.openSideBar) {
        this.$store.dispatch('setShowSide', false);
      } else {
        this.$store.dispatch('setShowSide', true);
      }
    }
  },
  created() {
    this.$store.dispatch("initData");
    this.$store.dispatch('setShowTrait', false);
    window.addEventListener('resize', this.updateStyle);
    this.updateStyle();
  },
  beforeDestroy() {
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

.btn-connect {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  width: 10%;
}
</style>
