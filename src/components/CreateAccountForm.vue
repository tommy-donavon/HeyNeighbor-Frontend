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
    <span class="p-float-label">
      <InputText id="firstName" v-model="firstnameValue" />
      <label for="firstName">First Name</label>
    </span>
    <span class="p-float-label">
      <InputText id="lastName" v-model="lastnameValue" />
      <label for="lastName">Last Name</label>
    </span>
    <span class="p-float-label">
      <InputText id="email" v-model="emailValue" />
      <label for="email">email</label>
    </span>
    <span class="p-float-label">
      <InputText id="phoneNumber" v-model="phoneValue" />
      <label for="phoneNumber">Phone Number</label>
    </span>
    <Dropdown
      v-model="selectedUserType"
      :options="userOptions"
      optionLabel="type"
      placeholder="Select User Type"
    />

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

//TODO add profile pic support //TODO check for already used username
//TODO better error feedback
<script>
import { ref, watchEffect } from 'vue';
import userClient from '@/clients/userClient.js';

export default {
  setup() {
    const usernameValue = ref('');
    const passwordValue = ref('');
    const verifyPasswordValue = ref('');
    const firstnameValue = ref('');
    const lastnameValue = ref('');
    const emailValue = ref('');
    const phoneValue = ref('');
    const selectedUserType = ref('');
    const isReady = ref(false);
    const onSubmit = async () => {
      const userInformation = {
        username: usernameValue.value,
        password: passwordValue.value,
        first_name: firstnameValue.value,
        last_name: lastnameValue.value,
        email: emailValue.value,
        phone_number: phoneValue.value,
        account_type: Number(selectedUserType.value.value),
        user_status: 1,
      };
      try {
        await userClient.createUserAccount(userInformation);
      } catch (err) {
        console.error(err);
      }
    };
    watchEffect(() => {
      var validUserName = usernameValue.value.length > 0;
      var validPasswordValue = passwordValue.value.length > 0;
      var matchPass = passwordValue.value === verifyPasswordValue.value;
      var validName =
        firstnameValue.value.length > 0 && lastnameValue.value.length > 0;
      var validEmail = emailValue.value.length > 0;
      var validPhone = phoneValue.value.length > 0;
      var validUserType = selectedUserType.value.value !== undefined;

      isReady.value = !(
        validUserName &&
        validPasswordValue &&
        matchPass &&
        validName &&
        validEmail &&
        validPhone &&
        validUserType
      );
    });
    return {
      usernameValue,
      passwordValue,
      verifyPasswordValue,
      onSubmit,
      isReady,
      firstnameValue,
      lastnameValue,
      emailValue,
      phoneValue,
      selectedUserType,
      userOptions: [
        { type: 'Propery-Manager/Landlord', value: 0 },
        { type: 'Tenant', value: 1 },
      ],
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
