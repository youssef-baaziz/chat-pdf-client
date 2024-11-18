<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import DOMPurify from "dompurify";

const store = useStore();
const content = ref("");
let showSidebar = computed(() => store.state.showSidebar);
const submitMessage = () => {
  const clean = DOMPurify.sanitize(content.value);
  if (clean.length) {
    store.dispatch("sendMessage", { content: clean, self_tf: true });
    content.value = "";
  }
};
</script>

<template>
  <div class="row mx-auto">
    <div class="float-right py-4 mt-auto fixed-bottom col-4"></div>
    <div class="float-left py-4 mt-auto fixed-bottom col-8 mx-auto  bg-white" :style="{ left: showSidebar ? '15%' : '0%' }">
      <div class=" mb-3 mt-2 flex ">
        <input type="text"
          class="rounded-l-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Posez n'importe quelle question." v-model="content" @keyup.enter="submitMessage" />
        <button class="w-16 rounded-r-xl hover:bg-blue-800 bg-dark" type="button" id="button-addon2"
          @click="submitMessage">
          <i class="pi pi-send cursor-pointer mx-auto" style="font-size: 1rem; color: white"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
button {
  background-color: #1777ff;
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