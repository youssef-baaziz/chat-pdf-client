<template>
  <header class="flex justify-between">
    <div class="row">
      <span v-if="!showSidebar" @click="toggleSidebar()" class="ml-1 col-2">
        <svg width="50px" height="50px" viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full"
          enable-background="new 0 0 76.00 76.00" xml:space="preserve" style="margin-top: 6px;">
          <path fill="#000000" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round"
            d="M 57,19L 57,57L 19,57L 19,19L 57,19 Z M 22,54L 54,54L 54,22.0001L 22,22L 22,54 Z M 24,24.0001L 36,24.0001L 36,52L 24,52L 24,24.0001 Z M 38,36L 46.6666,36L 42.9999,31.0001L 46.9999,31L 52,38L 46.9999,45L 42.9999,45L 46.6666,40L 38,40L 38,36 Z " />
        </svg>
      </span>
      <span class="text-2xl font-weight-bold mt-2 col" v-if="!showSidebar">Base de connaissances</span>
      <span class="text-2xl font-weight-bold mt-2 ml-3 col" v-if="showSidebar">Base de connaissances</span>
    </div>
    <nav>
      <ul class="flex space-x-3">
        <li class="mr-4 ml-4">
          <div class="dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <div class="row">
                <span class="name me-3 text-dark mt-3 font-weight-bold">{{ username }}</span>
                <img src="@/assets/images/avatar-anonymous.jpg" alt="User Avatar" class="user-avatar mt-1" />
              </div>
            </button>
            <div class="dropdown-menu desconnect" @click="logout">
              <a class="dropdown-item " >Se déconnecter</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const capitalize = (text) => {
  return typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
};

// Initialize store and refs
const store = useStore();
const router = useRouter();

let showSidebar = computed(() => store.state.showSidebar);

const userData = JSON.parse(localStorage.getItem('user'));
let username = Object.keys(userData).length > 0 ? `${capitalize(userData.lastname)} ${capitalize(userData.firstname)}` : "";

const toggleSidebar = () => {
  store.dispatch('setShowSide', true);
}

const logout = async () => {
  await store.dispatch('auth/signOut');
  router.push({ name: 'login' });
};
</script>

<style scoped>
ul {
  list-style: none;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.dropdown-toggle::after {
  display: none;
}

.btn-link {
  text-decoration: none;
}

#dropdownMenuButton:focus {
  outline: none;
  box-shadow: 1px 0px 0px 0px rgba(197, 200, 200, 0.5);;
}
.desconnect{
  cursor: pointer;
}
</style>
