<template>
  <div class="parent-form">
    <div class="account-form">
      <div>
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
      </div>
      <div>
        <span class="p-float-label">
          <InputText id="lastName" v-model="lastnameValue" />
          <label for="lastName">Last Name</label>
        </span>
        <span class="p-float-label">
          <InputText id="email" v-model="emailValue" />
          <label for="email">Email</label>
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
      </div>
      <input
        type="file"
        @change="changePic"
        accept="image/*"
        placeholder="select picture"
      />
      <!-- <FileUpload mode="basic" :customUpload="true" :disabled="true" accept="image/*" /> -->
      <!-- <Button id="submitBTN" label="upload" @click="onSubmit"/> -->
    </div>
    <Button
      class="p-button-danger"
      label="Submit"
      ref="submitBTN"
      :disabled="isReady"
      @click="onSubmit"
    />
  </div>
</template>

//TODO add profile pic support //TODO check for already used username //TODO
better error feedback
<script>
import { ref } from 'vue';
import BucketClient from '../clients/awsBucketClient.js';
// import userClient from '@/clients/userClient.js';

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
    let profile_pic = undefined;

    const changePic = (event) => {
      console.log(event.target.files[0]);
      profile_pic = event.target.files[0];
    };
    const onSubmit = async () => {
      try {
        const test = await BucketClient.uploadPhoto(
          usernameValue.value,
          profile_pic,
          profile_pic.type,
        );
        console.log(test)
      } catch (err) {
        console.error(err);
      }

      // const userInformation = {
      //   username: usernameValue.value,
      //   password: passwordValue.value,
      //   first_name: firstnameValue.value,
      //   last_name: lastnameValue.value,
      //   email: emailValue.value,
      //   phone_number: phoneValue.value,
      //   account_type: Number(selectedUserType.value.value),
      //   user_status: 1,
      // };
      // try {
      //   await userClient.createUserAccount(userInformation);
      // } catch (err) {
      //   console.error(err);
      // }
    };
    // watchEffect(() => {
    //   var validUserName = usernameValue.value.length > 0;
    //   var validPasswordValue = passwordValue.value.length > 0;
    //   var matchPass = passwordValue.value === verifyPasswordValue.value;
    //   var validName =
    //     firstnameValue.value.length > 0 && lastnameValue.value.length > 0;
    //   var validEmail = emailValue.value.length > 0;
    //   var validPhone = phoneValue.value.length > 0;
    //   var validUserType = selectedUserType.value.value !== undefined;

    //   isReady.value = !(
    //     validUserName &&
    //     validPasswordValue &&
    //     matchPass &&
    //     validName &&
    //     validEmail &&
    //     validPhone &&
    //     validUserType
    //   );
    // });
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
      profile_pic,
      changePic,
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
.account-form div > *:not(div) {
  margin: 5%;
  align-items: center;
}
.account-form div > div {
  margin-left: 5%;
}
.account-form {
  display: flex;
  flex-direction: row;
  align-content: center;
}
.parent-form {
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6, BB7 */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
  display: flex; /* NEW, Spec - Firefox, Chrome, Opera */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 1% 2% 1% 1%;
  border-radius: 5%;
  background-color: gray;
}

.p-field * {
  display: block;
}
</style>
