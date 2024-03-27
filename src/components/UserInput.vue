<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import DOMPurify from 'dompurify';

const store = useStore()
const content = ref('')



const submitMessage = () => {
    const clean = DOMPurify.sanitize(content.value);
    if (clean.length) {
        store.dispatch('sendMessage',{content:clean,self_tf:true});
        content.value = '';
    }
   
}


</script>

<template>



    <div class="mt-16 sticky flex">
        <input type="text"
            class="rounded-l-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Ask any question ..." v-model="content" @keyup.enter="submitMessage">
        <button class="w-16 rounded-r-xl hover:bg-blue-800" type="button" id="button-addon2" @click="submitMessage">
            <!-- <img  class="w-6 h-6 cursor-pointer mx-auto " src="../assets/icons/send.png" /> -->
            <i class="pi pi-send cursor-pointer  mx-auto" style="font-size: 1rem;color: white;"></i>
        </button>
    </div>
</template>

<style lang="less" scoped>
button {
    background-color: #1777FF;
}

input {
    border: 1px solid rgb(177, 177, 177);
    border-right: none;
    font-size: 16px;
    padding: 10px;
    padding-left: 20px;

}

input:focus {
    outline: none;
}
</style>