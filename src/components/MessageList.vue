<template>
  <div class="message w-full mx-auto" ref="messageList">
    <ul v-if="session">
      <li v-for="(item, index) in session.messages" :key="index">
        <div class="main" :class="{ self: item.self }" v-if="item?.content && item.content.trim() !== ''">
          <Message 
            severity="info"
            v-if="item.isLoad"
            v-html="htmlIsLoading"
          >
          </Message>
          <Message 
            severity="messagee"
            class="bg-gray-50 text max-w-0 element break-words" 
            :closable="false"
            v-else
          >
            <pre :class="item.self ? 'msg text-white' : 'msg'">{{ item.content }}</pre>
          </Message>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import Message from "primevue/message";
import autoAnimate from "@formkit/auto-animate";
import DOMPurify from 'dompurify';

export default {
  components: {
    Message,
  },
  data() {
    return {
      dropdown: null,
      htmlIsLoading:  `<div>` +
                      `<span class="spinner-grow text-info spinner-grow-sm mr-2" role="status" aria-hidden="true"></span>` +
                      `En train d'écrire...` +
                      `</div>`,
    };
  },
  methods: {
    sanitizedContent(content) {
      return DOMPurify.sanitize(content);
    },
    adjustScrollbar() {
      const container = this.$refs.messageList;
      if (container) {
        const bodyHeight = window.innerHeight;
        const contentHeight = container.scrollHeight;
        // Adjust the height of the container
        if (contentHeight < bodyHeight) {
          container.style.height = `${contentHeight}px`;

        } else {
          container.style.height = '880px'; // Default height or any max height
        }
      }
    },
  },
  computed: {
    store() {
      return useStore();
    },
    session() {
      const store = useStore();
      const sessions = store.state.sessions;
      const currentSessionId = store.state.currentSessionId;
      return sessions.find((session) => session.id === currentSessionId);
    },
    list_message() {
      return this.session.messages.length;
    },
    isLoading() {
      return this.store.state.isLoad;
    }
  },
  mounted() {
    this.dropdown = this.$refs.messageList;
    autoAnimate(this.dropdown, { duration: 500 });
    this.$store.dispatch("restart");
    this.$store.dispatch("setIsUpload", false);
    this.adjustScrollbar(); // Adjust on mount
    window.addEventListener('resize', this.adjustScrollbar);
  },
  watch: {
    list_message(val) {
      this.$nextTick(() => {
        const container = this.$refs.messageList;
        if (container) {
          container.scrollTop = container.scrollHeight;
          this.adjustScrollbar();
        }
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.adjustScrollbar); // Cleanup event listener
  },
};
</script>
<style lang="less" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.8s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.message {
  padding: 10px 15px;
  width: 75%;
  height: 880px;
  overflow-y: auto;

  li {
    margin-bottom: 8px;
  }

  .text {
    display: inline-block;
    position: relative;
    padding: 10px 20px;
    max-width: ~"calc(100% - 20%)";
    min-height: 30px;
    text-align: left;
  }

  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }

    .text {
      background-color: rgb(63 63 70);
      color: white;
    }
  }

  ul {
    list-style: none;
  }
  .msg {
    font-family: Inter var, sans-serif;
    font-size: 1rem;
    margin: 0.5px;
    white-space: pre-wrap; 
    word-wrap: break-word;
  }
}

</style>
