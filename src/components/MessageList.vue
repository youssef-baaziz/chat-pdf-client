<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex'
import Message from 'primevue/message';
import autoAnimate from "@formkit/auto-animate"

const store = useStore()
const sessions = store.state.sessions
const currentSessionId = store.state.currentSessionId
const session = computed(() => {

    return sessions.find(session => session.id === currentSessionId)
})
const dropdown = ref() // we need a DOM node
onMounted(() => {
    autoAnimate(dropdown.value, { duration: 50000 }) // thats it!
})
const vScrollBottom = {
    mounted: (el) => {
        el.scrollTop = el.scrollHeight - el.clientHeight;

    },
    updated: (el) => {
        el.scrollTop = el.scrollHeight - el.clientHeight;

    }
}
</script>


<template>
    <div class="message w-full " ref="dropdown" v-scroll-bottom="session">
        <ul v-if="session">
            <li v-for="item in session.messages">
                <div class="main " :class="{ self: item.self }">
                    <Message severity="message" class="bg-gray-50 text max-w-0 element  break-words" :closable="false"
                        v-html="item.content"></Message>
                </div>

            </li>
        </ul>
    </div>

</template>

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
    overflow-y: auto;
    height: 700px;

    li {
        margin-bottom: 15px;
    }


    .text {
        display: inline-block;
        position: relative;
        padding: 10px 20px;
        max-width: ~'calc(100% - 20%)';
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
            background-color: #1777FF;
            color: white;

        }
    }

    ul {
        list-style: none;
    }

}
</style>