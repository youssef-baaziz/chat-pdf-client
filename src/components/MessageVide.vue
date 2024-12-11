<template>
  <div>
    <div class="w-full mx-auto font-weight-bold" style="color: darkslategrey;" v-if="loadingFile">
      <span class="col">En cours de téléchargement...</span>
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" class="col" />
    </div>
    <div class="message w-full mx-auto" ref="messageList">
      <div class="centered-container" v-if="session.messages.length === 0">
        <div class="text-center content-btn">
          <label class="form-label cursor-pointer mt-3 mb-4 row" style="width: 130%;" v-if="!showTrait">
            <button class="btn btn-sm btn-secondary rounded font-weight-bold btn-upload" @click="triggerFileUpload()">
              <i class="pi pi-file font-weight-bold mr-4"></i>
              <span>Ajout de fichier ( PDF / TXT / WORD )</span>
            </button>
          </label>
          <button class="btn btn-sm btn-secondary rounded font-weight-bold btn-upload row" @click="uploadFile()"
            v-if="showTrait">
            <i class="pi pi-cog font-weight-bold mr-4"></i>
            <span>Traiter le(s) fichier(s)</span>
          </button>
        </div>
        <input type="file" accept="application/pdf,application/msword,text/plain,.docx" id="formFile" ref="fileInput"
          multiple @change="handleFileChange" style="display: none;" />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { HTTP } from "@/lib/axios";
import ProgressSpinner from 'primevue/progressspinner';
import Message from "primevue/message";

export default {
  components: { ProgressSpinner, Message },
  data() {
    return {
      dropdown: null,
      loadingFile: false,
      files: []
    };
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();  // Programmatically clicks the hidden file input
      this.$store.dispatch('setDescription', []);
    },
    handleFileChange() {
      const fileInput = this.$refs.fileInput;
      if (fileInput && fileInput.files) {
        this.files = Array.from(fileInput.files); // Convert FileList to Array
        this.$store.dispatch('setFilesUpload', this.files);
        this.$store.dispatch('setIsChosen', true);
        
        let desc = []
        this.files.forEach((file,index) => {
          desc[index] = ""
        })
        this.$store.dispatch('setDescription', desc);
        this.$store.dispatch('setShowTrait', true);
      }
    },
    setActiveSetDescriptions(){
      console.log("here1");
      this.$store.dispatch('setActiveSetDescription',true)
    },
    callSetDescription() {
      console.log("this.$parent.$refs",this.$parent.$refs.sidebarRef);
      this.$parent.$refs.sidebarRef.setDescription();
    },
    async uploadFile() {
      this.callSetDescription()
      const fileInput = this.$refs.fileInput;
      try {
        let desc = []
        this.loadingFile = true;
        const formData = new FormData();
        this.files.forEach((fileItem,idx) => {
          formData.append("files", fileItem);
          desc[idx] = ""
        });

        console.log("description cddzdz",this.description);
        this.description.forEach(item => {
          formData.append(`description`, item);
        });

        const userData = JSON.parse(localStorage.getItem('user'));

        formData.append("user_id", userData.id)
        fileInput.value = null;
        const response = await HTTP.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.uploadMessage();
        const responseFiles = await HTTP.post("/files", { user_id: userData.id });
        this.$store.dispatch("setlabelsName", responseFiles.data);

        this.restart(); // Reset the state
        this.setShowNewConversation(false)
        this.$store.dispatch("setIsChosen", false);
        this.$store.dispatch('setIsUpload', true);
        this.$store.dispatch("setfirstTimeUpload", true);
        this.$store.dispatch('setActiveSetDescription',false)
        this.$store.dispatch('sendMessage', { content: response.data['answer'], self_tf: false });
      } catch (error) {
        if(error.response && error.response.status !== 401){
          this.failedMessage()
          console.error("Error occurred:", error);
        }
      } finally {
        this.loadingFile = false;
        this.$store.dispatch("setIsLoadUpdate", false);
      }
    },
    setShowNewConversation(statut) {
      this.$store.dispatch('setShowNewConversation', statut);
    },
    setDescription() {
      this.filesUpload.forEach((elm, index) => {
        if (!this.description[index]) {
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
      this.$store.dispatch("setSuccessAlert", true);
      setTimeout(() => {
        this.$store.dispatch("setSuccessAlert", false);
      }, 2000);
    },
    failedMessage() {
      this.$store.dispatch("setFailedAlert", true);
      setTimeout(() => {
        this.$store.dispatch("setFailedAlert", false);
      }, 2000);
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
    },
    descriptionSet() {
      return this.$store.state.descriptionSet;
    },
    showTrait() {
      return this.$store.state.showTrait;
    }
  },
  watch:{
    descriptionSet(newValue) {
      console.log("here2",newValue);
      // if (newValue == true) {
        console.log('Action in MessageVide: Uploading file');
        this.uploadFile();
        this.$store.dispatch('setDescriptionSet', false);
      // }
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
  margin-left: 100px;
  /* Add any other styling here */
}

.btn-upload {
  width: 130%;
  min-width: auto;
  font-size: 1.1rem;
  line-height: 52px;
  background-color: #ecf0f0;
  color: rgb(101, 102, 102);

  i {
    font-size: 1.4rem;
  }
}
.message-alert{
  width: 19rem;
  position: absolute;
  right: 1%;
  top: 12%;
}
</style>
