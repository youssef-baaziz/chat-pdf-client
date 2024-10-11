import './assets/main.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import router from './router'

import VueDOMPurifyHTML from 'vue-dompurify-html';

import { createApp } from 'vue'
import store from '@/store'
import App from './App.vue'
import PrimeVue from 'primevue/config';

const app = createApp(App)
app.use(VueDOMPurifyHTML);

app.use(store)
app.use(router)
app.use(PrimeVue)
app.mount('#app')