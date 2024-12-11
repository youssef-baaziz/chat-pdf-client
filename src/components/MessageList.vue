<template>
  <div v-if="isLoading">
    <div class="d-flex justify-content-center align-items-center mb-2" style="color: darkslategrey;height: 90vh;">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" class="col" />
    </div>
  </div>
  <div class="message w-full mx-auto" ref="messageList" v-else>
    <ul v-if="session">
      <li v-for="(item, index) in session.messages" :key="index">
        <div class="main" :class="{ self: item.self }" v-if="item?.content && item.content.trim() !== ''">
          <span class="msg-load float-left mr-5" v-if="item.content === 'loading'">
            <div class="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </span>
          <Message severity="messagee" class="bg-gray-50 text max-w-0 element break-words p-message-b" :closable="false" v-else>
            <pre :class="item.self ? 'msg text-white' : 'msg'">{{ item.content }}</pre>
          </Message>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from "vuex";
import Message from "primevue/message";
import Button from 'primevue/button';
import autoAnimate from "@formkit/auto-animate";
import ProgressSpinner from 'primevue/progressspinner';
import DOMPurify from 'dompurify';

export default {
  components: {
    Message,
    "Button": Button,
    "ProgressSpinner": ProgressSpinner
  },
  data() {
    return {
      dropdown: null,
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
          container.style.height = '82%'; // Default height or any max height
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageList = this.$refs.messageList;
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      });
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
      return this.store.state.isLoading;
    },
    isTreatedFile() {
      return this.store.state.isTreatedFile;
    },
  },
  mounted() {
    // this.dropdown = this.$refs.messageList;
    // autoAnimate(this.dropdown, { duration: 500 });
    this.$store.dispatch("restart");
    this.$store.dispatch("setIsUpload", false);
    this.adjustScrollbar(); // Adjust on mount
    window.addEventListener('resize', this.adjustScrollbar);
  },
  watch: {
    'session.messages': {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
    },
  },
  beforeUnmount() {
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
  height: 82%;
  overflow-y: auto;

  li {
    margin-bottom: 8px;
  }

  .text {
    display: inline-block;
    position: relative;
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

.msg-load {
  font-family: Inter var, sans-serif;
  font-size: 1rem;
  margin: 10px 28px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 77vh;
  /* Full viewport height */
  margin-right: 220px;
}

.content-btn {
  text-align: center;
  /* Add any other styling here */
}

.btn-upload {
  width: 200%;
  font-size: 1.4rem;
  line-height: 60px;
  background-color: #ecf0f0;
  color: rgb(101, 102, 102);

  i {
    font-size: 1.4rem;
  }
}
.loading-dots {
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-dots div {
    width: 10px;
    height: 10px;
    margin: 0 3px;
    background-color: #333;
    border-radius: 50%;
    animation: bounce 0.6s infinite alternate;
}

.loading-dots div:nth-child(1) {
    animation-delay: 0s;
}

.loading-dots div:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dots div:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-14px);
    }
}

</style>
