<template>
  <div class="sidebar bg-light p-3" v-if="showSidebar">
    <i class=" pi pi-bars h5 fixed-top mt-2 ml-1" @click="toggleSidebar()"></i>
    <div v-if="filesUpload.length > 0">
      <h5 class="text-center">Fichiers sélectionnés</h5>
      <h6 class="border-bottom mb-2"></h6>
      <div style="max-height: 300px;min-height: 50px; overflow-y: auto;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item border-0 mb-1 col style_file_upload" v-for="(file, index) in filesUpload"
            :key="index">
            <div class="row">
              <span class="float-left col-10">{{ isChosen ? file.name : file[1] }}</span>
              <i class="pi pi-pencil text-info mr-2" @click="showDescription[index] = !showDescription[index]"></i>
              <i class="pi pi-trash text-danger" @click="removeFile(index)" v-if="isChosen"></i>
            </div>
            <div class="row mt-2" v-if="showDescription[index]">
              <div class="inputr">
                <span class="font-weight-bold mt-2">Description : </span>
                <input v-model="description[index]" type="text" class="form-control" />
                <div class="btn btn-secondary btn-sm mt-2 col"
                  @click="setValueIdentifiant(isChosen ? file.name : file[1], index)" v-if="!isChosen">
                  Enregistrer
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <h5 class="text-center" v-if="showSave">les autres Fichiers sélectionnés</h5>
      <h6 class="border-bottom mb-2" v-if="showSave"></h6>
      <div style="max-height: 200px;min-height: 50px; overflow-y: auto;" v-if="showSave">
        <ul class="list-group list-group-flush">
          <li class="list-group-item border-0 mb-1 col style_file_upload" v-for="(file, index) in otherFiles"
            :key="index">
            <div class="row">
              <span class="float-left col-10">{{ file.name }}</span>
              <i class="pi pi-pencil text-info mr-2" @click="showNewDescription[index] = !showNewDescription[index]"></i>
              <i class="pi pi-trash text-danger" @click="removeOtherFile(index)"></i>
            </div>
            <div class="row mt-2" v-if="showNewDescription[index]">
              <div class="inputr">
                <span class="font-weight-bold mt-2">Description : </span>
                <input v-model="new_descriptions[index]" type="text" class="form-control" />
                <div class="btn btn-secondary btn-sm mt-2 col"
                  @click="setValueIdentifiant(file.name , index)" v-if="!isChosenOther">
                  Enregistrer
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <span class="btn btn-sm btn-secondary float-left mt-1" v-if="!showSave">
        <span class="font-weight-bold" @click="triggerFileUpload()">Ajouter autre(s) fichier(s)</span>
      </span>
      <span class="btn btn-sm btn-secondary float-right mt-1" v-if="showSave">
        <span class="font-weight-bold" @click="uploadOtherFiles()">Traiter le(s) fichier(s)</span>
      </span>
      <div class="w-full mx-auto font-weight-bold float-left" style="color: darkslategrey;" v-if="loadingFile">
      <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" class="col" />
      </div>
    </div>
    <h5 class="border-bottom mt-5"></h5>
    <h5 class="text-center">Historique</h5>
    <h5 class="border-bottom mb-2"></h5>
    <span class="btn btn-md mb-2 w-100 btn-new py-2" @click="setShowNewConversation(false)">
      <span class="float-left">Nouvelle conversation</span>
      <i class="pi pi-pencil float-right"></i>
    </span>
    
    <ul class="list-group list-group-flush history-list">
      <li class="list-group-item border-0 font-weight-bold mb-1 item-history" :class="item[0] == selectedItem ||
        item[0] == selectedItem2 ||
        isItemHovered(item)
        ? 'selected-item'
        : 'unselected-item'
        " v-for="(item, index) in labelsName" :key="index" @mouseover="handleMouseOver(index, item)"
        @mouseleave="handleMouseLeave(item)">
        <div>
          <template v-if="isEditing && editingItemId === item[0]">
            <div class="input">
              <input v-model="newName" @blur="saveEdit(item)" @keyup.enter="saveEdit(item)" type="text"
                class="form-control" />
            </div>
          </template>
          <template v-else>
            <span @click="selectItem(item)" class="text-truncated">{{
              item[1]
            }}</span>
          </template>
          <span class="setting pr-2" v-show="showPlay === index || item[0] == selectedItem || item[0] == selectedItem2"
            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="pi pi-ellipsis-h cursor-pointer font-weight-bold style-icon"></i>
          </span>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#" @click="startEdit(item)">
              <i class="pi pi-pencil mr-2"></i>
              <span>Renommer</span>
            </a>
            <a class="dropdown-item text-danger" href="#" @click="setToDeleteHistory(item[0])">
              <i class="pi pi-trash mr-2"></i>
              <span>Supprimer</span>
            </a>
          </div>
        </div>
      </li>
    </ul>

    <Dialog v-model:visible="visible" modal header="Supprimer un fichier" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Êtes-vous sûr de vouloir supprimer ce fichier ?
      </span>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-secondary" @click="visible = false">Annuler</button>
        <button type="button" class="btn btn-danger" @click="deleteFile()">Supprimer</button>
      </div>
    </Dialog>

    <Dialog v-model:visible="visibleHistory" modal header="Supprimer un Historique" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Êtes-vous sûr de vouloir supprimer cette Historique ?
      </span>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-secondary" @click="visibleHistory = false">Annuler</button>
        <button type="button" class="btn btn-danger" @click="removeItem()">Supprimer</button>
      </div>
    </Dialog>
    <input type="file" accept="application/pdf,application/msword,text/plain,.docx" id="formFile" ref="fileInput"
          multiple @change="handleFileChange" style="display: none;" />

  </div>
</template>
<script>
import { HTTP } from "@/lib/axios";
import { useStore } from "vuex";
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: "Sidebar",
  components: {
    "Dialog": Dialog,
    "ProgressSpinner": ProgressSpinner,
  },
  data() {
    return {
      history: [],
      isload: false,
      selectedItem: 0,
      selectedItem2: 0,
      showPlay: -1,
      playing_index: [],
      show: false,
      visible: false,
      visibleHistory: false,
      hoveredIndex: null,
      identifiant: "",
      isEditing: false,
      isClickForedit: false,
      editingItemId: null,
      deleteHistoryId: "",
      deleteFileId: "",
      newName: "",
      history_list: [],
      description: [],
      new_descriptions: [],
      showDescription: [],
      showNewDescription: [],
      otherFiles: [],
      showSave: false,
      isChosenOther: false,
      loadingFile: false
    };
  },
  computed: {
    store() {
      return useStore();
    },
    sessions() {
      return this.store.state.sessions;
    },
    currentSessionId() {
      return this.store.state.currentSessionId;
    },
    session() {
      return this.sessions.find(
        (session) => session.id === this.currentSessionId
      );
    },
    labelsName() {
      return this.store.state.labelsName;
    },
    filesUpload() {
      return this.store.state.filesUpload;
    },
    isChosen() {
      return this.store.state.isChosen;
    },
    firstTimeUpload() {
      return this.store.state.firstTimeUpload;
    },
    showSidebar() {
      return this.store.state.showSidebar;
    },
    showNewConversation() {
      return this.store.state.showNewConversation;
    },
    activeSetDescription() {
      return this.$store.state.activeSetDescription;
    },
    descriptionSet() {
      console.log("udfugufg",this.$store.state.descriptionSet);
      return this.$store.state.descriptionSet;
    },
  },
  methods: {
    removeFile(index) {
      this.filesUpload.splice(index, 1); // Remove the file at the specified index
      this.description.splice(index, 1);
      this.showDescription.splice(index, 1);
    },
    removeOtherFile(index) {
      this.otherFiles.splice(index, 1);
      this.description.splice(index, 1);
      this.showNewDescription.splice(index, 1);
      if(this.otherFiles.length == 0){
        this.showSave = false;
      }
    },
    toggleSidebar() {
      this.$store.dispatch('setShowSide', false);
    },
    setShowNewConversation(statut) {
      this.$store.dispatch('setShowNewConversation', statut);
      this.$store.dispatch('setActiveSetDescription',false);
      this.description = [];
      this.$store.dispatch('setShowTrait', false);
      if(statut == false){
        this.selectedItem = 0
        this.$store.dispatch('setFilesUpload', []);
      }
    },
    handleMouseOver(index, item) {
      this.hoveredIndex = index;
      this.showPlay = index;
      this.selectedItem2 = item[0];
    },
    handleMouseLeave(item) {
      this.hoveredIndex = null;
      this.showPlay = -1;
      if (this.isEditing == false || this.isClickForedit == false || this.isItemHovered(item) == false) {
        this.selectedItem2 = 0;
      } else {
        this.selectedItem2 = item[0];
      }
    },
    isItemHovered(item) {
      return (
        this.hoveredIndex !== null &&
        this.labelsName[this.hoveredIndex][0] === item[0]
      );
    },
    selectItem(item) {
      this.$store.dispatch('setChatVide', false);
      this.selectedItem = item[0];
      this.isEditing = false;
      this.history_list = item;
      this.$store.dispatch('setIsLoading', true);
      this.getConversationChat(item);
      this.setShowNewConversation(true)
    },
    getFilesByHistory(history_id){
      HTTP.post("/files-by-history", {
        history_id: history_id,
      })
        .then((response) => {
          this.$store.dispatch('setFilesUpload', response.data.files);
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    getConversationChat(item) {
      this.$store.dispatch("restart");
      HTTP.post("/history", {
        history_file_json: item[2],
        history_id: item[0],
      })
        .then((response) => {
          this.history = response.data.history;
          this.$store.dispatch('setHistory', this.history);
          this.getFilesByHistory(item[0])
          this.$store.dispatch("setIsChosen", false);
          for (let i = 0; i < this.history.length; i++) {
            this.playing_index[i] = false;
          }
          this.history.forEach((element) => {
            this.session.messages.push({
              content: element["question"],
              date: new Date(),
              self: true,
              id: element["id"],
            });

            this.session.messages.push({
              content: element["answer"],
              date: new Date(),
              self: false,
              id: element["id"],
            });
          });
          this.$store.dispatch("setIsUpload", true);
          this.$store.dispatch("sendMessage", {
            content: response.data["answer"],
            self_tf: false,
          });
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    getfileNameOfConversationChat() {
      const userData = JSON.parse(localStorage.getItem('user'));
      HTTP.post("/files", { user_id: userData.id })
        .then((response) => {
          this.$store.dispatch("setlabelsName", response.data);
          // this.$store.dispatch("setFilesUpload", []);
          // this.$store.dispatch("setFilesUpload", response.data);
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    startEdit(item) {
      this.isEditing = true;
      this.isClickForedit = true;
      this.editingItemId = item[0];
      this.newName = item[1];
    },
    saveEdit(item) {
      if (this.newName.trim() === "") {
        alert("Name cannot be empty.");
        return;
      }

      HTTP
        .post("/rename", {
          identifiant: this.newName,
          history_id: item[0],
        })
        .then((response) => {
          this.getfileNameOfConversationChat()
          this.isEditing = false;
          this.editingItemId = null;
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    setToDeleteHistory(history_id) {
      this.visibleHistory = true;
      this.deleteHistoryId = history_id;
    },
    removeItem() {
      HTTP
        .post("/delete", {
          history_id: this.deleteHistoryId,
        })
        .then((response) => {
          this.getfileNameOfConversationChat()
          this.$store.dispatch('setFilesUpload', []);
          this.visibleHistory = false
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    deleteFile() {
      HTTP
        .post("/delete-file", {
          file_id: this.deleteFileId,
        })
        .then((response) => {
          this.getConversationChat(this.history_list)
          this.getfileNameOfConversationChat()
          this.visible = false
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    setValueIdentifiant(filename, index) {
      HTTP.post("/edit-description", {
        filename: filename,
        description: this.description[index],
      })
        .then((response) => {
          this.showDescription[index] = false;
          this.getConversationChat(this.history_list)
          this.getfileNameOfConversationChat();
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();  // Programmatically clicks the hidden file input
    },
    handleFileChange() {
      const fileInput = this.$refs.fileInput;
      if (fileInput && fileInput.files) {
        this.otherFiles = Array.from(fileInput.files);
        this.otherFiles.forEach((file,index) => {
          this.new_descriptions[index] = ""
        })
        this.showSave = true;
      }
      this.isChosenOther = true;
    },
    async uploadOtherFiles(){
      const fileInput = this.$refs.fileInput;
      try {
        this.loadingFile = true;
        const formData = new FormData();
        let desc = []
        this.otherFiles.forEach((fileItem,i) => {
          formData.append("new_files", fileItem);
          desc[i] = ""
        });

        this.new_descriptions.forEach(item => {
          formData.append("new_descriptions", item);
        });
        
        formData.append("history_id", this.history_list[0])
        fileInput.value = null;
        await HTTP.post('/upload-other-files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(()=>{
          this.getConversationChat(this.history_list)
          this.getfileNameOfConversationChat()
          this.showSave = false;
        });
        this.uploadMessage();
        const responseFiles = await HTTP.post("/files", { user_id: userData.id });
        this.$store.dispatch("setlabelsName", responseFiles.data);
        this.$store.dispatch("setIsChosen", false);
        this.isChosenOther = false;
        this.$store.dispatch("restart");
        this.setShowNewConversation(false)
        this.$store.dispatch('setIsUpload', true);
        // this.$store.dispatch("setfirstTimeUpload", true);
        // this.$store.dispatch('sendMessage', { content: response.data['answer'], self_tf: false });
      } catch (error) {
        if(error.response && error.response.status !== 401){
          this.failedMessage()
          console.error("Error occurred:", error);
        }
      } finally {
        this.loadingFile = false;
        this.$store.dispatch('setIsLoading', false);
        this.$store.dispatch("setIsLoadUpdate", false);
      }
    },
    setDescription(){
      this.$store.dispatch('setDescription', this.description)
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
  mounted() {
    this.getfileNameOfConversationChat();
    for (let index = 0; index < this.filesUpload.length; index++) {
      this.showDescription[index] = false;
    }
  },
  watch: {
    labelsName(val) {
      if (val.length != 0) {
        if (this.firstTimeUpload == true) {
          this.selectItem(val[0])
        }
      }
    },
    // activeSetDescription(val){
    //   console.log("valnnnnn",val);
    //   console.log("descriptionfzefze",this.description);
    //   if(val == true){
    //     this.$store.dispatch('setDescription', this.description).then(() => {
    //       console.log("here3");
    //       this.$store.dispatch('setDescriptionSet', true);
    //     });
    //   }
    // },
    filesUpload(val) {
      if (val.length != 0) {
        if (val.files && val.files.length != 0) {
          let files = val.files;
          files.forEach((elm, index) => {
            // this.description[index] = "";
            // if(elm[2] != ""){
            //   this.showDescription[index] = true;
            // }
          });
        } else {
          val.forEach((elm, index) => {
            this.description[index] = elm[2];
            this.showDescription[index] = false;
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.sidebar {
  height: 100%;
  width: 500px;
  max-width: 500px;
  min-width: 500px !important;
  color: black;
  min-height: 90%;
  overflow-y: auto;
}

.item-history:hover {
  color: rgb(39, 37, 35);
  cursor: pointer;
  background-color: rgb(230, 235, 232);
  border: 1px;
  border-radius: 14px;
}

.selected-item {
  color: rgb(39, 37, 35);
  background-color: rgb(230, 235, 232);
  border: 1px;
  border-radius: 14px;
}

.unselected-item {
  color: black;
  background-color: #f8f9fa;
}

.setting {
  cursor: pointer;
  position: absolute;
  color: rgb(51, 37, 138);
  right: 0px;
  top: 17px;
}

.style-icon {
  font-size: 25px;
}

.text-truncated {
  display: inline-block;
  max-width: 24ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 17px;
}

.form-control {
  width: 100%;
  display: inline-block;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.input {
  padding-right: 18px;
}

.style_file_upload {
  font-size: 12px;
}
.btn-new{
  font-weight: 500;
  background-color: #e3eaf2;
}
.btn-new:hover{
  background-color: #d5dee8;
}
.history-list{
  max-height: 450px;
  min-height: 350px; 
  overflow-y: auto;
}
</style>
