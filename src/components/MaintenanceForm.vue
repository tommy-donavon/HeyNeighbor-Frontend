<template>
  <Toast />
  <Toast position="top-center" group="tc" />
  <div class="maintaince-info">
      <span class="p-float-label">
          <InputText id="title" type="text" />
          <label for="title">Request Title</label>
      </span>
  </div>

</template>

<script>
export default {
    name:'MaintainceForm'

}
</script>

<style>

</style>