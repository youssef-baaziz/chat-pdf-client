<script setup>
import { ref } from "vue"
import Message from 'primevue/message';
import axios from 'axios'
import { useStore } from 'vuex'

const store = useStore()
const file = ref(null);
const successAlert = ref(false);
const failedAlert = ref(false);
const restartAlert = ref(false);
const uploadFile = async () => {
    try {
    let formData = new FormData();
    formData.append('uploaded_file', file.value.files[0]);
    
    file.value.value=null
    axios.post('http://127.0.0.1:8000/context',    formData,
    {
            headers: {
                
                'Content-Type': 'multipart/form-data' // Ensure proper content type header
            }
        }
    
    )
        .then((response) => {
            
            localStorage.setItem('hashValue',response.data['hash_key'])
            uploadMessage(); 
            store.dispatch('setIsUpload',true);
            store.dispatch('sendMessage', {content:response.data['answer'],self_tf:false});
        })
        .catch((error) => {
            failedMessage();
            console.error('Error occurred:', error);
        });
} catch (error) {
    console.error('Error occurred:', error);
}

    

}
const restart = () => {
    store.dispatch('restart')
    store.dispatch('setIsUpload',false);
}
const uploadMessage = ()=>{
        successAlert.value = !successAlert.value
}

const failedMessage = () =>{
    failedAlert.value = !failedAlert.value
}

const restartMessage = () =>{
    restartAlert.value = !restartAlert.value
}

</script>

<template>
    <header class="flex justify-between ">
        <div>
            <span class="text-3xl">
                Chat
            </span>
        </div>
        <nav>
            <ul class="flex space-x-4">
                <li><label for="formFile" class="form-label">
                        <!-- <img class="w-4 h-4 cursor-pointer hover:animate-bounce " src="../assets/icons/upload.svg" alt="Upload Your File">    -->
                        <i class="pi pi-download cursor-pointer" style="font-size: 1rem"></i>
                        <Message class="absolute z-10" severity="success" :sticky=false v-if="successAlert":life="2000"  v-on:life-end="uploadMessage()">Fichier importé avec succès</Message>
                        <Message class="absolute z-10" severity="error" :sticky=false v-if="failedAlert":life="2000"  v-on:life-end="failedMessage">Erreur d'importation </Message>
                        
                    </label></li>
                <li @click="restart">
                    <!-- <img class="w-4 h-4 cursor-pointer shadow-2xl hover:animate-bounce " src="../assets/icons/restart.png" alt="Clear the chat"> -->
                    <i class="pi pi-refresh cursor-pointer" style="font-size: 1rem" @click="restartMessage"></i>
                    <Message class="absolute z-10" severity="info" :sticky=false v-if="restartAlert":life="2000"  v-on:life-end="restartMessage">Recommencer votre chat</Message>
                </li>
            </ul>
        </nav>
    </header>

    <input type="file" accept="application/pdf" id="formFile" ref="file" v-on:change="uploadFile()" >
</template>

<style scoped>
input {
    display: none;
}

ul {
    list-style: none;
}
</style>
