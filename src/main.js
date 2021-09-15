import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Cloudinary from 'cloudinary-vue';
import Primevue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';

createApp(App)
  .use(store)
  .use(router)
  .use(Primevue)
  .use(Cloudinary, {
    configuration: {
      cloudName: 'dcuitzplw',
    },
  })
  .component('InputText', InputText)
  .component('Password', Password)
  .component('Button', Button)
  .component('FileUpload', FileUpload)
  .component('Dropdown', Dropdown)
  .mount('#app');
