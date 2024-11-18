<template>
  <header class="flex justify-between bg-light">
    <div class="mt-2">
      <i class="pi pi-bars h5 ml-2" v-if="!showSidebar" @click="toggleSidebar()"></i>
      <span class="text-2xl font-weight-bold ml-3">Interroger vos documents</span>
    </div>
    <nav>
      <ul class="flex space-x-3">
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

.dropdown-toggle::after{
  display: none;
}

.btn-link{
  text-decoration: none;
}
</style>
