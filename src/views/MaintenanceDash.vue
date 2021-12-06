<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <i
        class="pi pi-arrow-left back"
        style="color:white;"
        @click="() => router.go(-1)"
      />
      <Button
        label="New Request"
        @click="() => (state.formVisible = !state.formVisible)"
      />
    </template>
  </Toolbar>
  <Dialog
    header="Please enter your information below"
    v-model:visible="state.formVisible"
    style="width:fit-content;"
  >
    <MaintenanceForm :server_code="state.server_code" />
  </Dialog>
  <div class="main-container">
    <div class="spacer">
      <hr />
      <span>Requested</span>
      <hr />
    </div>
    <div class="content">
      <Card
        v-for="(req, index) in state.toDos"
        :key="index"
        style="width:15rem;"
      >
      <template #header>
          <i
            class="pi pi-times"
            style="float: right;margin:10px;"
          ></i>
          <Dialog
            header="Please Provided Rejection Reason Below"
            style="width:fit-content;"
            v-model:visible="state.deleteVisible"
          >
            
              <div style="display:flex;flex-direction:column;gap:15px;">
                <div class="p-float-label">
                  <InputText id="rejectReason" />
                  <label for="rejectReason">Reason</label>
                </div>
                <Button label="Submit" />
              </div>
  
          </Dialog>
        </template>
        <template #title>
          {{ req.title }}
        </template>
        <template #content>
          {{ req.description }}<br /><br />Severity:
          {{ state.severity[req.severity] }}
        </template>
      </Card>
    </div>
    <div class="spacer">
      <hr />
      <span>Started</span>
      <hr />
    </div>
    <div class="content">
      <Card
        v-for="(req, index) in state.progress"
        :key="index"
        style="width:15rem;"
      >
        <template #title>
          {{ req.title }}
        </template>
        <template #content>
          {{ req.description }}<br /><br />Severity:
          {{ state.severity[req.severity] }}
        </template>
      </Card>
    </div>
    <div class="spacer">
      <hr />
      <span>Completed</span>
      <hr />
    </div>
    <div class="content">
      <Card
        v-for="(req, index) in state.complete"
        :key="index"
        style="width:15rem;"
      >
        <template #title>
          {{ req.title }}
        </template>
        <template #content>
          {{ req.description }}<br /><br />Severity:
          {{ state.severity[req.severity] }}
        </template>
        <template #footer>
          <Button @click="confirmDone(req)" label="Confrim" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import MaintenanceForm from '../components/MaintenanceForm.vue';
import { reactive, toRefs, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import client from '../clients/maintenanceClient';
export default {
  name: 'Maintenance-Dash',
  setup(props) {
    const { server_code } = toRefs(props);
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      formVisible: false,
      server_code: server_code.value,
      mainRequest: [],
      toDos: [],
      progress: [],
      complete: [],
      severity: ['Low', 'Moderate', 'Critical'],
      deleteVisible: false,

    });

    onBeforeMount(async () => {
      const token = store.getters.getCurrentToken;
      try {
        state.mainRequest = await client.getUserMaintenanceRequest(
          state.server_code,
          token,
        );
        state.toDos = state.mainRequest.filter(
          (r) =>
            !r.admin_checked_done && !r.tenant_checked_done && !r.in_progress,
        );
        state.progress = state.mainRequest.filter(
          (r) =>
            !r.admin_checked_done && !r.tenant_checked_done && r.in_progress,
        );
        state.complete = state.mainRequest.filter(
          (r) =>
            r.admin_checked_done && !r.tenant_checked_done && r.in_progress,
        );
      } catch (err) {
        console.error(err);
      }
    });

    const confirmDone = async (request) => {
      state.complete = state.complete.filter(r => r.ID !== request.ID)
      const token = store.getters.getCurrentToken
      try {
        await client.deleteMaintenanceRequest(request.ID, token)
      }catch(err){
        console.error(err)
      }

    }

    return {
      state,
      router,
      confirmDone
    };
  },
  components: {
    MaintenanceForm,
  },
  props: {
    server_code: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.back:hover {
  cursor: pointer;
}

.p-toolbar-group-left > * {
  margin: 5px;
}

.main-container {
  display: flex;
  flex-flow: column nowrap;
  margin: 10px;
  gap: 5px;
  .spacer {
    gap: 10px;
    display: flex;
    hr {
      border-top: 2px solid white;
      width: 100%;
    }
    span {
      color: white;
    }
  }
  .content {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    // justify-content: space-evenly;
    align-content: center;
  }
}
</style>
