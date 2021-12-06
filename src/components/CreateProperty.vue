<template>
  <Toast />
  <Toast position="top-center" group="tc" />
  <div class="parent-form">
   <div class="p-float-label">
      <InputText
        id="propertyName"
        v-model="state.propertyName.value"
        :class="{ 'p-isInvalid': state.propertyName.isInvalid }"
        @focus="() => (state.propertyName.focused = true)"
      />
      <label for="propertyName" :class="{ 'p-error': state.propertyName.isInvalid }"
        >Property Name</label
      >
    </div>
   <div class="address-parent" style="display:flex;justify-content:space-evenly;gap:15px;">
     <div style="display:flex;flex-direction:column;gap:25px;">
       <div class="p-float-label">
      <InputText
        id="streetAddress"
        v-model="state.streetAddress.value"
        :class="{ 'p-isInvalid': state.streetAddress.isInvalid }"
        @focus="() => (state.streetAddress.focused = true)"
      />
      <label for="streetAddress" :class="{ 'p-error': state.streetAddress.isInvalid }"
        >Street Address</label
      >
    </div>
   <div class="p-float-label">
      <InputText
        id="city"
        v-model="state.city.value"
        :class="{ 'p-isInvalid': state.city.isInvalid }"
        @focus="() => (state.city.focused = true)"
      />
      <label for="city" :class="{ 'p-error': state.city.isInvalid }"
        >City</label
      >
    </div>
     </div>
     <div style="display:flex;flex-direction:column;gap:25px;">
<div class="p-float-label">
      <InputText
        id="state"
        v-model="state.selectedState.value"
        :class="{ 'p-isInvalid': state.selectedState.isInvalid }"
        @focus="() => (state.selectedState.focused = true)"
      />
      <label for="state" :class="{ 'p-error': state.selectedState.isInvalid }"
        >State</label
      >
    </div>
   <div class="p-float-label">
      <InputText
        id="propertyName"
        v-model="state.propertyName.value"
        :class="{ 'p-isInvalid': state.propertyName.isInvalid }"
        @focus="() => (state.propertyName.focused = true)"
      />
      <label for="propertyName" :class="{ 'p-error': state.propertyName.isInvalid }"
        >Zip Code</label
      >
    </div>
     </div>
   
   </div>
   
    <Button label="Submit"  />
  </div>
</template>

<script>
import {reactive,watchEffect} from 'vue'
export default {
  name:'CreatePropertyForm',
  setup(){
    const state = reactive({
      propertyName: { value: '', isInvalid: true, focused: false },
      streetAddress: { value: '', isInvalid: true, focused: false },
      city: { value: '', isInvalid: true, focused: false },
      selectedState: { value: '', isInvalid: true, focused: false },
      zip: { value: '', isInvalid: true, focused: false },
    })

    watchEffect(() => {
      state.propertyName.isInvalid = state.propertyName.focused && !/^\w+$/.test(state.propertyName.value)
    })

    return {state}
  }

}
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

.parent-form {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  align-content: space-around;
  gap: 25px;
}
</style>
