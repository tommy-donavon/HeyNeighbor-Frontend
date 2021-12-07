<template>
  <Toolbar style="background-color:transparent;border:none;">
    <template #left>
      <i
        class="pi pi-arrow-left back"
        style="color:white;"
        @click="() => router.go(-1)"
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
  <div
    v-if="state.toDos.length || state.progress.length || state.complete.length"
    class="main-container"
  >
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
            @click="
              () => (state.rejectionFormVisible = !state.rejectionFormVisible)
            "
          ></i>
          <Dialog
            header="Please Provided Rejection Reason Below"
            style="width:fit-content;"
            v-model:visible="state.rejectionFormVisible"
          >
            <div style="display:flex;flex-direction:column;gap:15px;">
              <div class="p-float-label">
                <InputText id="rejectReason" />
                <label for="rejectReason">Reason</label>
              </div>
              <Button label="Submit" />
            </div>
          </Dialog>
          <!-- <Image v-if="req.image_uri" :src="req.image_uri" imageStyle="object-fit:cover;object-position: 0px 120px;" preview /> -->
        </template>
        <template #title>
          {{ req.title }}
        </template>
        <template #content>
          User: {{ req.tenant }}<br />
          Unit#: {{ req.unit_number }}<br />
          Description: {{ req.description }}<br />Severity:
          {{ state.severity[req.severity] }}
          <div v-if="req.image_uri" style="margin-top:5px;">
          </div>
        </template>
        <template #footer>
          <Button @click="moveCard('toDos', 'progress', req)" label="Start" />
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
          User: {{ req.tenant }}<br />
          Unit#: {{ req.unit_number }}<br />
          Description: {{ req.description }}<br />
          Severity: {{ state.severity[req.severity] }}<br />
          <div v-if="req.image_uri">
            <Button label="Show Image" />
          </div>
        </template>
        <template #footer>
          <Button
            @click="moveCard('progress', 'complete', req)"
            label="Mark Done"
          />
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
          User: {{ req.tenant }}<br />
          Unit#: {{ req.unit_number }}<br />
          Description: {{ req.description }}<br />Severity:
          {{ state.severity[req.severity] }}
          <div v-if="req.image_uri">
            <Button label="Show Image" />
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div v-else style="display:flex; justify-content:center; align-items:center;">
    <h3 style="color:white;">No request have been made on this property</h3>
  </div>
</template>

<script>
import MaintenanceForm from '../components/MaintenanceForm.vue';
import { reactive, toRefs, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import client from '../clients/maintenanceClient';
export default {
  name: 'Admin-Maintenance-Dash',
  setup(props) {
    const { server_code } = toRefs(props);
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      formVisible: false,
      rejectionFormVisible: false,
      server_code: server_code.value,
      mainRequest: [],
      toDos: [],
      progress: [],
      complete: [],
      severity: ['Low', 'Moderate', 'Critical'],
      showImage: false
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

    const moveCard = async (from, to, request) => {
      state[to].push(request);
      state[from] = state[from].filter((r) => r.ID !== request.ID);
      if (request.in_progress) {
        request.admin_checked_done = true;
      } else {
        request.in_progress = true;
      }
      const token = store.getters.getCurrentToken;

      try {
        await client.updateMaintenanceRequest(request, token);
      } catch (err) {
        console.error(err);
      }
    };

    return {
      state,
      router,
      moveCard,
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
