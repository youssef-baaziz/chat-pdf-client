<template>
  <div class="sidebar bg-light p-3" v-if="showSidebar">
    <i class=" pi pi-bars h5" @click="toggleSidebar()"></i>
    <div v-if="filesUpload.length">
      <h5 class="text-center">Fichiers sélectionnés</h5>
      <h6 class="border-bottom mb-2"></h6>
      <div style="max-height: 300px;min-height: 50px; overflow-y: auto;">
        <ul class="list-group list-group-flush">
          <li
            class="list-group-item border-0 mb-1 col style_file_upload"
            v-for="(file, index) in filesUpload"
            :key="index"
          >
            <div class="row">
              <span class="float-left col-10">{{ isChosen ? file.name : file[1] }}</span>
              <i class="pi pi-pencil text-info mr-2" @click="showDescription[index] = !showDescription[index]"></i>
              <i class="pi pi-trash text-danger" @click="removeFile(index, file[0])"></i>
            </div>
            <div class="row mt-2" v-if="showDescription[index]">
              <div class="inputr">
                <span class="font-weight-bold mt-2">Description : </span>
                <input v-model="description[index]" type="text" class="form-control" />
                <div
                  class="btn btn-secondary btn-sm mt-2 col"
                  @click="setValueIdentifiant(isChosen ? file.name : file[1], index)"
                  v-if="!isChosen"
                >
                  Enregistrer
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <h5 class="border-bottom mt-5"></h5>
    <h5 class="text-center">Historique</h5>
    <h5 class="border-bottom mb-2"></h5>
    <ul class="list-group list-group-flush">
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
          <span class="setting pr-2" 
          v-show="showPlay === index || item[0] == selectedItem || item[0] == selectedItem2" 
          id="dropdownMenuButton" data-toggle="dropdown" 
          aria-haspopup="true" aria-expanded="false"
          >
            <i class="pi pi-ellipsis-h cursor-pointer font-weight-bold style-icon"></i>
          </span>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#" @click="startEdit(item)">
              <i class="pi pi-pencil mr-2"></i>
              <span>Renommer</span>
            </a>
            <a class="dropdown-item text-danger" href="#" @click="removeItem(item)">
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

  </div>
</template>
<script>
import axios from "axios";
import { useStore } from "vuex";
import Dialog from 'primevue/dialog';

export default {
  name: "Sidebar",
  components:{
    "Dialog":Dialog
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
      hoveredIndex: null,
      identifiant: "",
      isEditing: false,
      isClickForedit: false,
      editingItemId: null,
      deleteFileId: "",
      newName: "",
      history_list: [],
      description: [],
      showDescription: [],
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
  },
  methods: {
    removeFile(index,file_id) {
      if(this.isChosen == true){
        this.filesUpload.splice(index, 1); // Remove the file at the specified index
        this.description.splice(index, 1);
        this.showDescription.splice(index, 1);
      } else {
        this.visible = true;
        this.deleteFileId = file_id;
      }
    },
    toggleSidebar() {
      this.store.dispatch('setShowSide', false);
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
      this.selectedItem = item[0]; // Set the selected item
      this.isEditing = false;
      this.history_list = item;
      this.getConversationChat(item);
    },
    getConversationChat(item) {
      this.store.dispatch("restart");
      this.store.dispatch('setIsLoad', true);
      axios
        .post("http://127.0.0.1:5054/history", {
          history_file_json: item[2],
          history_id: item[0],
        })
        .then((response) => {
          this.history = response.data.history;
          console.log("hesi",this.history);
          this.store.dispatch('setHistory', this.history);
          this.store.dispatch('setIsLoad', false);
          console.log("filesUpload2",response.data.files);
          this.store.dispatch('setFilesUpload', response.data.files);
          this.store.dispatch("setIsChosen", false);
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
          this.store.dispatch("setIsUpload", true);
          this.store.dispatch("sendMessage", {
            content: response.data["answer"],
            self_tf: false,
          });
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    getfileNameOfConversationChat() {
      axios
        .post("http://127.0.0.1:5054/files")
        .then((response) => {
          console.log("filesUpload",response.data);
          this.store.dispatch("setlabelsName", response.data);
          // this.store.dispatch("setFilesUpload", []);
          // this.store.dispatch("setFilesUpload", response.data);
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

      axios
        .post("http://127.0.0.1:5054/rename", {
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
    removeItem(item) {
      axios
        .post("http://127.0.0.1:5054/delete", {
          history_id: item[0],
        })
        .then((response) => {
          this.getfileNameOfConversationChat()
          this.store.dispatch('setFilesUpload', []);
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    },
    deleteFile() {
      axios
        .post("http://127.0.0.1:5054/delete-file", {
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
    setDescription(){
      this.filesUpload.forEach((elm,index) => {
        if (!this.description[index]) {
          //this.$set(this.description, index, "");
          this.description[index] = "";
        }
      });
      this.store.dispatch('setDescription', this.description);
    },
    setValueIdentifiant(filename,index){
      console.log("filename => ",filename);
      console.log("description => ",this.description);
      axios.post("http://127.0.0.1:5054/edit-description", {
          filename: filename,
          description: this.description[index],
        })
        .then((response) => {
          this.showDescription[index] = false;
          console.log("history_list",this.history_list);
          this.getConversationChat(this.history_list)
          this.getfileNameOfConversationChat();
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
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
    filesUpload(val){
      console.log(val);
      if (val.length != 0) {
        if (val.files && val.files.length != 0) {
          let files = val.files;
          files.forEach((elm,index) => {
            //this.description[index] = elm[2];
            // if(elm[2] != ""){
            //   this.showDescription[index] = true;
            // }
          });
        } else {
          val.forEach((elm,index) => {
            //this.description[index] = elm[2];
            // if(elm[2] != ""){
            //   this.showDescription[index] = true;
            // }
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
  width: 400px;
  max-width: 400px;
  min-width: 400px !important;
  color: black;
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
</style>
