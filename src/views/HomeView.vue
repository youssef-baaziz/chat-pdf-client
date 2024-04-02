<script setup>
import MessageList from '@/components/MessageList.vue'
import UserInput from '@/components/UserInput.vue'
import Header from '@/components/Header.vue'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('initData')
</script>

<template>
    <div class="w-6/12 h-6/5 container mx-auto mt-8 " >
        <Header />
            <MessageList />
            <UserInput />   
    </div>

    
</template>

<style lang="less" scoped>

</style>
