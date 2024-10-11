<template>
  <div id="app" class="d-flex scroll">
    <Sidebar ref="sidebarRef" />
    <div class="flex-grow-1">
      <Header @handleDescription="handleDescription" />
      <ChatWindow />
      <inputChat />
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import ChatWindow from '../components/MessageList.vue';
import inputChat from '../components//UserInput.vue';

import { useStore } from "vuex";
export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    ChatWindow,
    inputChat
  },
  data() {
    return {
      newMessage: "",
      openSideBar: true
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
    sendMessage(newMessage) {
      if (newMessage.trim()) {
        this.messages.push({ content: newMessage, self: true });
      }
    },
    handleDescription() {
      this.$refs.sidebarRef.setDescription(); // Calls the method in Sidebar via the ref
    },
  },
  computed: {
    store() {
      return useStore();
    },
    showSidebar() {
      return this.store.state.showSidebar;
    },
  },
  created() {
    this.$store.dispatch("initData");
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
</style>
