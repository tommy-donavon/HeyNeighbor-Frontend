<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <h2 style="color:white;user-select:none;">Hey Neighbor</h2>
    </template>
    <template #right>
      <Button
        icon="pi pi-github"
        class="p-button-rounded"
        style="margin-right:5px;"
      />
      <Button label="Log in" @click="ToggleLogin('showLogin')" />
      <Dialog
        header="Please Enter Your Information Below"
        v-model:visible="state.showLogin"
        style="width:fit-content;"
      >
        <LoginForm />
      </Dialog>
    </template>
  </Toolbar>
  <div class="my-grid">
    <div class="row">
      <div class="column">
        <div class="landing-info">
          <div></div>
          <h1 style="color:white;">
            Welcome to<br />
            the Neighborhood
          </h1>
          <div>
            <Button label="Get Started" @click="ToggleLogin('showRegister')" />
            <Dialog
              header="Please Enter Your Information Below"
              v-model:visible="state.showRegister"
              style="width:fit-content;"
            >
              <CreateAccountForm />
            </Dialog>
          </div>
        </div>
      </div>
      <div class="column">
        <div>
          <img
            src="../assets/img/landing_chi.jpg"
            style="height:86.18vh;width:100vw;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import LoginForm from '../components/LoginForm';
import CreateAccountForm from '../components/CreateAccountForm.vue'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      showLogin: false,
      showRegister: false,
    });
    const ToggleLogin = (element) => {
      state[element] = !state[element];
    };

    return {
      state,
      ToggleLogin,
    };
  },
  components: {
    LoginForm,
    CreateAccountForm
  },
};
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.my-grid {
  border-radius: 5px;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  min-height: 100%;
}

.landing-info {
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;

  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;

  align-items: center;
  justify-content: space-between;
}
.landing-info > * {
  flex: 0 0 120px;
}

.landing-info > h1 {
  font-size: 50px;
}
.p-toolbar-group-right > * {
  margin-left: 5px;
}
</style>
