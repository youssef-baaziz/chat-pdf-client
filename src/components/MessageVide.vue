<template>
  <div class="message w-full mx-auto" ref="messageList">
    <div class="centered-container" v-if="session.messages.length === 0">
      <div class="text-center content-btn">
        <label class="form-label cursor-pointer mt-3 mb-4 row" style="width: 200%;">
          <button class="btn btn-sm btn-secondary rounded font-weight-bold btn-upload" @click="triggerFileUpload()">
            <i class="pi pi-spin pi-file font-weight-bold mr-4"></i>
            <span>Ajout de fichier PDF</span>
          </button>
        </label>
        <button class="btn btn-sm btn-secondary rounded font-weight-bold btn-upload row" @click="uploadFile()">
          <i class="pi pi-spin pi-cog font-weight-bold mr-4"></i>
          <span>Traité fichier PDF</span>
        </button>
      </div>
      <input type="file" accept="application/pdf,application/msword,text/plain,.docx" id="formFile" ref="fileInput"
        multiple @change="handleFileChange" style="display: none;" />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { HTTP } from "@/lib/axios";

export default {
  data() {
    return {
      dropdown: null,
      successAlert: false,
      failedAlert: false,
      files: []
    };
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();  // Programmatically clicks the hidden file input
    },
    handleFileChange() {
      const fileInput = this.$refs.fileInput;
      if (fileInput && fileInput.files) {
        this.files = Array.from(fileInput.files); // Convert FileList to Array
        this.$store.dispatch('setFilesUpload', this.files);
        this.$store.dispatch('setIsChosen', true);
      }
    },
    async uploadFile() {
      this.$store.dispatch("setIsLoadUpdate", true);
      const fileInput = this.$refs.fileInput;
      try {
        const formData = new FormData();
        console.log("files", this.files[0]);
        this.files.forEach(fileItem => {
          formData.append("files", fileItem);
        });

        this.setDescription();
        this.description.forEach(item => {
          formData.append("description", item);
        });

        const userData = JSON.parse(localStorage.getItem('user'));

        formData.append("user_id",userData.id)
        fileInput.value = null;
        const response = await HTTP.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const responseFiles = await HTTP.post("/files", { user_id: userData.id });
        this.$store.dispatch("setlabelsName", responseFiles.data);

        this.uploadMessage(); // Display success message
        this.restart(); // Reset the state
        this.$store.dispatch('setIsUpload', true);
        this.$store.dispatch("setfirstTimeUpload", true);
        this.$store.dispatch('sendMessage', { content: response.data['answer'], self_tf: false });
      } catch (error) {
        this.failedMessage(); // Display error message
        console.error("Error occurred:", error);
      } finally {
        this.$store.dispatch("setIsLoadUpdate", false);
      }
    },
    setDescription() {
      this.filesUpload.forEach((elm, index) => {
        if (!this.description[index]) {
          //this.$set(this.description, index, "");
          this.description[index] = "";
        }
      });
      this.$store.dispatch('setDescription', this.description);
    },
    restart() {
      this.$store.dispatch("restart");
      this.$store.dispatch("setIsUpload", false);
    },
    uploadMessage() {
      this.successAlert = true;
    },
    failedMessage() {
      this.failedAlert = true;
    }
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
    description() {
      return this.$store.state.description;
    },
    filesUpload() {
      return this.$store.state.filesUpload;
    }
  },
  mounted() {
    this.$store.dispatch("restart");
    this.$store.dispatch("setIsUpload", false);
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
  min-width: auto;
  font-size: 1.1rem;
  line-height: 52px;
  background-color: #ecf0f0;
  color: rgb(101, 102, 102);

  i {
    font-size: 1.4rem;
  }
}
</style>
