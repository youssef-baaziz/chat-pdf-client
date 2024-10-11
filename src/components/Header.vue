<script setup>
import { ref, computed } from "vue";
import Message from "primevue/message";
import axios from "axios";
import { useStore } from "vuex";

// Initialize store and refs
const store = useStore();
const fileInput = ref(null);
const files = ref([]);
const loading = ref(false);
const successAlert = ref(false);
const failedAlert = ref(false);
const restartAlert = ref(false);

// Handle file selection
const handleFileChange = () => {
  store.dispatch('setFilesUpload', []);
  if (fileInput.value && fileInput.value.files) {
    files.value = Array.from(fileInput.value.files); // Convert FileList to Array
  }
  store.dispatch('setFilesUpload', files.value);
  store.dispatch('setIsChosen', true);
};

const emit = defineEmits(["handleDescription"]);

const getDescription = () => {
  emit("handleDescription")
};
let description = computed(() => store.state.description);

// Upload files to the server
const uploadFile = async () => {
  loading.value = true;
  try {
    let formData = new FormData();
    files.value.forEach(fileItem => {
      formData.append("files", fileItem);
    });
    getDescription()
    console.log("ggg",description.value);
    let data = description.value
    console.log("vjvufgjgig",data);
    data.forEach(item => {
      formData.append("description", item);
    });
    fileInput.value.value = null; // Clear file input

    const response = await axios.post('http://127.0.0.1:5054/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const responseFiles = await axios.post('http://127.0.0.1:5054/files');
    store.dispatch("setlabelsName", responseFiles.data);

    uploadMessage();
    restart();
    store.dispatch('setIsUpload', true);
    store.dispatch("setfirstTimeUpload", true);
    store.dispatch('sendMessage', { content: response.data['answer'], self_tf: false });

  } catch (error) {
    failedMessage();
    console.error("Error occurred:", error);
  } finally {
    loading.value = false;
  } 
};

let showSidebar = computed(() => store.state.showSidebar);

const toggleSidebar = () => {
  store.dispatch('setShowSide', true);
};

// Restart the process
const restart = () => {
  store.dispatch("restart");
  store.dispatch("setIsUpload", false);
};

// Toggle success message
const uploadMessage = () => {
  successAlert.value = !successAlert.value;
};

// Toggle failed message
const failedMessage = () => {
  failedAlert.value = !failedAlert.value;
};

// Toggle restart message
const restartMessage = () => {
  restartAlert.value = !restartAlert.value;
};
</script>

<template>
  <header class="flex justify-between bg-light">
    <div class="mt-2">
      <i class=" pi pi-bars h5 ml-2" v-if="showSidebar == false" @click="toggleSidebar()"></i>
      <span class="text-2xl font-weight-bold ml-3">Interroger vos documents</span>
    </div>
    <nav>
      <ul class="flex space-x-3">
        <li class="mr-4 mt-3" style="margin-top: 12px;" v-if="loading">
          <span class="spinner-grow spinner-grow-sm text-info" role="status" aria-hidden="true"></span>
          En cours de téléchargement...
        </li>
        <li class="mr-4" style="margin-top: 12px;">
          <div class="btn btn-sm btn-dark rounded font-weight-bold" @click="uploadFile()">Traiter</div>
        </li>
        <li>
          <label for="formFile" class="form-label">
            <i class="pi pi-download cursor-pointer mt-3 font-weight-bold" style="font-size: 1rem"></i>
            <Message class="absolute z-10 message-alert" severity="success" :sticky="false" v-if="successAlert"
              :life="2000" v-on:life-end="uploadMessage()">
              Fichier importé avec succès
            </Message>
            <Message class="absolute z-10 message-alert" severity="error" :sticky="false" v-if="failedAlert"
              :life="2000" v-on:life-end="failedMessage">
              Erreur d'importation
            </Message>
          </label>
        </li>
        <li @click="restart()">
          <i class="pi pi-refresh cursor-pointer mt-3 ml-1 font-weight-bold" style="font-size: 1rem"></i>
          <Message class="absolute z-10 message-alert" severity="info" :sticky="false" v-if="restartAlert" :life="2000"
            v-on:life-end="restartMessage">
            Importer fichier et recommencer votre chat
          </Message>
        </li>
        <li class="mr-3"></li>
      </ul>
    </nav>
  </header>

  <input type="file" accept="application/pdf,application/msword,text/plain,.docx" id="formFile" ref="fileInput" multiple @change="handleFileChange" />

</template>

<style scoped>
input {
  display: none;
}

ul {
  list-style: none;
}

.message-alert {
  right: 650px;
  top: 64px;
}
</style>
