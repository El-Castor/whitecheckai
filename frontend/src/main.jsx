// frontend/src/main.jsx
import { createApp } from 'vue';
import App from './App.jsx';
import router from './router';

createApp(App).use(router).mount('#app');
