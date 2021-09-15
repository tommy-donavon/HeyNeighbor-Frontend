<template>
  <div class="account-form">
    <span class="p-float-label">
      <InputText id="username" type="text" v-model="usernameValue" />
      <label for="username">Username</label>
    </span>
    <span class="p-float-label">
      <Password id="password" v-model="passwordValue" />
      <label for="password">Password</label>
    </span>
    <span class="p-float-label">
      <Password
        id="verify-password"
        :feedback="false"
        v-model="verifyPasswordValue"
      />
      <label for="verify-password">Please Verify Password</label>
    </span>
    <Button
      label="submit"
      ref="submitBTN"
      :disabled="isReady"
      @click="onSubmit"
    />
    <!-- <FileUpload mode="basic" :customUpload="true" :showCancelButton="true" @select="onSelect"  /> -->
    <!-- <Button id="submitBTN" label="upload" @click="onSubmit"/> -->
  </div>
</template>

//TODO add profile pic support //TODO add support to check for already used
username
<script>
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const usernameValue = ref('');
    const passwordValue = ref('');
    const verifyPasswordValue = ref('');
    const isReady = ref(false);
    const onSubmit = () => {};
    watchEffect(() => {
        isReady.value = !(verifyPasswordValue.value === passwordValue.value && verifyPasswordValue.value.length > 0 && passwordValue.value.length > 0)
    })
    return {
      usernameValue,
      passwordValue,
      verifyPasswordValue,
      onSubmit,
      isReady,
    
    };
  },

};
</script>

<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
.account-form > * {
  margin: 30px 0;
}

.p-field * {
  display: block;
}
</style>
