<template>
  <div class="dash-options">
    <Card
      @click="ToggleIsVisable"
      style="border-radius:10px;"
    >
      <template #header>
        <img
          alt="property header"
          :src="optImg"
          style="height:15rem;width:100%;"
        />
      </template>
      <template #title>
        <h3>{{ optName }}</h3>
      </template>
      <template #subtitle>
        <p>
          {{optDescription}}
        </p>
      </template>
    </Card>
    <Dialog
        :header="optName"
        v-model:visible="isVisable"
        style="width:fit-content;"
        class="p-dialog-maximized"
        position="bottom"
        :modal="true"
      >
      <slot />
      </Dialog>
  </div>
</template>

<script>
import {ref} from "vue"
export default {
  name: 'DashOptions',
  setup() {
    const isVisable = ref(false)
    const ToggleIsVisable = () => {
      isVisable.value = !isVisable.value
    }

    return {isVisable, ToggleIsVisable}
  },
  props: {
    optImg: {
      type: String,
    },
    optName: {
      type: String,
      required: true,
    },
    optFunction: {
      type: Function,
      required: true,
    },
    optDescription:{
      type: String,
      required: true
    }
  },
};
</script>

<style lang="scss" scoped>
.dash-options {
  margin: 5%;
}
</style>
