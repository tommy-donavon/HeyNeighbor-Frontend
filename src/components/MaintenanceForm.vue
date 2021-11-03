<template>
  <Toast />
  <Toast position="top-center" group="tc" />
  <div class="maintaince-info">
    <span class="p-float-label">
      <InputText
        id="title"
        type="text"
        v-model="state.title"
        style="width: 100%;"
      />
      <label for="title">Request Title</label>
    </span>
    <span class="p-float-label">
      <Textarea
        id="description"
        type="text"
        v-model="state.description"
        style="width:100%;"
      />
      <label for="description">Request Description</label>
    </span>
    <Dropdown v-model="selectedSeverity" :options="severityOptions" class="drop" />
    <Button label="Submit" @click="submitRequest" />
  </div>
</template>

<script>
import { reactive, toRefs,ref, watchEffect } from 'vue';
import client from '../clients/maintenanceClient';
import { useStore } from 'vuex';
export default {
  name: 'MaintainceForm',
  setup(props) {
    const store = useStore();
    const { server_code } = toRefs(props);
    const state = reactive({
      title: '',
      description: '',
      severity: 0,
      property_code: server_code,
    });

    const selectedSeverity = ref('Low')
    const severityOptions = ref(['Low', 'Moderate', 'Critical'])

    watchEffect(() => state.severity = severityOptions.value.indexOf(selectedSeverity.value))

    const submitRequest = async () => {
      try {
        const token = store.getters.getCurrentToken;
        await client.createMaintenanceRequest(
          state.property_code,
          state,
          token,
        );
      } catch (err) {
        console.error(err);
      }
    };

    return {
      state,
      submitRequest,
      selectedSeverity,
      severityOptions
    };
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
.maintaince-info {
  display: flex;
  flex-flow: column nowrap;
  gap: 25px;
}
</style>
