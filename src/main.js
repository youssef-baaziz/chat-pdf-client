// Importing styles and libraries
import './assets/main.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';


import { createApp } from 'vue';
import router from '@/router';
import store from '@/store'; // Import the Vuex store
import App from './App.vue';
import PrimeVue from 'primevue/config';
import VueDOMPurifyHTML from 'vue-dompurify-html';

// Create Vue app and register plugins
const app = createApp(App);
app.use(VueDOMPurifyHTML);
app.use(store); // Register the Vuex store
app.use(router);
app.use(PrimeVue);
app.mount('#app');
