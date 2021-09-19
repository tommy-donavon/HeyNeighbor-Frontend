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
import Ripple from 'primevue/ripple'
import tooltip from 'primevue/tooltip'
import Dock from 'primevue/dock';
import PanelMenu from 'primevue/panelmenu'
import Textarea from 'primevue/textarea'

createApp(App)
  .use(store)
  .use(router)
  .use(Primevue)
  .use(Cloudinary, {
    configuration: {
      cloudName: 'dcuitzplw',
    },
  })
  .directive('ripple', Ripple)
  .directive('tooltip',tooltip)
  .component('InputText', InputText)
  .component('Password', Password)
  .component('Button', Button)
  .component('FileUpload', FileUpload)
  .component('Dropdown', Dropdown)
  .component('Dock', Dock)
  .component('PanelMenu',PanelMenu)
  .component('Textarea', Textarea)
  .mount('#app');
