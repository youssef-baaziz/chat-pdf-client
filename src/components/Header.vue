<script setup>
import { ref, computed, defineEmits } from "vue";
import Message from "primevue/message";
import { HTTP } from "@/lib/axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// Utility function to capitalize text
const capitalize = (text) => {
  return typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
};

// Initialize store and refs
const store = useStore();
const router = useRouter();
const fileInput = ref(null);
const files = ref([]);
const successAlert = ref(false);
const failedAlert = ref(false);

// Emit for parent component communication
/* const emit = defineEmits(["handleDescription"]); */

// Computed properties for store states
let description = computed(() => store.state.description);
let showSidebar = computed(() => store.state.showSidebar);
let isLoadUpdate = computed(() => store.state.isLoadUpdate);
let chatVide = computed(() => store.state.chatVide);

const userData = JSON.parse(localStorage.getItem('user'));
let username = Object.keys(userData).length > 0 ? `${capitalize(userData.lastname)} ${capitalize(userData.firstname)}` : "";

// Handle file selection
const handleFileChange = () => {
  console.log("fileInput.value.files",fileInput.value.files);
  if (fileInput.value && fileInput.value.files) {
    files.value = Array.from(fileInput.value.files); // Convert FileList to Array
    console.log('files.value',files.value[0].name);
    store.dispatch('setFilesUpload', files.value);
    store.dispatch('setIsChosen', true);
  }
};
let filesUpload = computed(() => store.state.filesUpload);
const setDescription = () => {
  console.log('filesUpload',filesUpload.value[0].name);
  for (let index = 0; index < filesUpload.value.length; index++) {
    if (!description.value[index]) {
      description.value[index] = "";
    }
  }
  // filesUpload.value.forEach((elm, index) => {
  //   if (!description[index]) {
  //     //this.$set(this.description, index, "");
  //     description[index] = "";
  //   }
  // });
  store.dispatch('setDescription', description.value);
};

// Upload files to the server
const uploadFile = async () => {
  store.dispatch("setIsLoadUpdate", true);
  try {
    const formData = new FormData();
    files.value.forEach(fileItem => {
      formData.append("files", fileItem);
    });

    setDescription();
    description.value.forEach(item => {
      formData.append("description", item);
    });

    const userData = JSON.parse(localStorage.getItem('user'));

    formData.append("user_id",userData.id)

    // Clear file input after preparing formData
    fileInput.value.value = null;

    // Perform file upload to the server
    const response = await HTTP.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const responseFiles = await HTTP.post("/files",{user_id:userData.id});
    store.dispatch("setlabelsName", responseFiles.data);

    uploadMessage(); // Display success message
    restart(); // Reset the state
    store.dispatch('setIsUpload', true);
    store.dispatch("setfirstTimeUpload", true);
    store.dispatch('sendMessage', { content: response.data['answer'], self_tf: false });
  } catch (error) {
    failedMessage(); // Display error message
    console.error("Error occurred:", error);
  } finally {
    store.dispatch("setIsLoadUpdate", false);
  }
};

const triggerFileUpload = () => {
  fileInput.value.click();  // Programmatically clicks the hidden file input
};

// Restart the process
const restart = () => {
  store.dispatch("restart");
  store.dispatch("setIsUpload", false);
};

// Toggle success message
const uploadMessage = () => {
  successAlert.value = true;
  setTimeout(() => {
    successAlert.value = false; // Reset the alert after 2 seconds (2000 ms)
  }, 2000);
};

// Toggle failed message
const failedMessage = () => {
  failedAlert.value = true;
  setTimeout(() => {
    failedAlert.value = false; // Reset the alert after 2 seconds (2000 ms)
  }, 2000);
};

const toggleSidebar = () => {
  store.dispatch('setShowSide', true);
}
// Logout functionality
const logout = async () => {
  await store.dispatch('auth/signOut');
  router.push({ name: 'login' });
};

</script>

<template>
  <header class="flex justify-between bg-light">
    <div class="mt-2">
      <i class="pi pi-bars h5 ml-2" v-if="!showSidebar" @click="toggleSidebar()"></i>
      <span class="text-2xl font-weight-bold ml-3">Interroger vos documents</span>
    </div>
    <nav>
      <ul class="flex space-x-3">
        <li v-if="isLoadUpdate" class="mr-4 mt-3">
          <span class="spinner-grow spinner-grow-sm text-info" role="status" aria-hidden="true"></span>
          En cours de téléchargement...
        </li>
        <li class="mr-4 mt-3" v-if="!chatVide">
          <button class="btn btn-sm btn-secondary rounded font-weight-bold" @click="uploadFile()">
            <i class="pi pi-cog font-weight-bold mr-2" style="font-size: 1rem"></i>
            <span>Traiter</span>
          </button>
        </li>
        <li class="mr-5" v-if="!chatVide">
          <label for="formFile" class="form-label cursor-pointer mt-3">
            <button class="btn btn-sm btn-secondary rounded font-weight-bold" @click="triggerFileUpload()">
              <i class="pi pi-file font-weight-bold mr-2" style="font-size: 1rem"></i>
              <span>Ajouter un fichier</span>
            </button>
          </label>
        </li>
        <li class="mr-5">
          <Message class="message-alert" severity="success" v-if="successAlert" :life="200" v-on:life-end="uploadMessage">
            Fichier importé avec succès
          </Message>
          <Message class="message-alert" severity="error" v-if="failedAlert" :life="2000" v-on:life-end="failedMessage">
            Erreur d'importation
          </Message>
        </li>
        <li class="mr-4 ml-4">
          <div class="dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div class="row">
                <span class="name me-3 text-dark mt-3 font-weight-bold">{{ username }}</span>
                <img src="@/assets/images/avatar-anonymous.jpg" alt="User Avatar" class="user-avatar mt-1" />
              </div>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" @click="logout">Se déconnecter</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </header>
  <input type="file" accept="application/pdf,application/msword,text/plain,.docx" id="formFile" ref="fileInput" multiple @change="handleFileChange" style="display: none;"/>
  
</template>

<style scoped>
input {
  display: none;
}

ul {
  list-style: none;
}

.message-alert {
  position: absolute;
  right: 40%;
  top: 37px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.dropdown-toggle::after{
  display: none;
}

.btn-link{
  text-decoration: none;
}
</style>
