<template>
  <div class="pic-form">
    <input
      type="file"
      name="myImage"
      accept="image/*"
      @change="cropper($event)"
    />
    <Avatar
      v-if="!state.imageUploaded"
      :label="firstName.toUpperCase() + lastName.toUpperCase()"
      size="large"
    />
    <Avatar v-else :image="state.imagePreview" size="large" />
  </div>
</template>

<script>
import { reactive } from 'vue';
export default {
  name: 'PictureCropper',
  setup(props,{emit}) {

    const state = reactive({
      imageUploaded: false,
      imagePreview: '',
    });

    const cropper = (elem) => {
      state.imageUploaded = true
      state.imagePreview = URL.createObjectURL(elem.target.files[0])
      emit('selectedPicture', elem.target.files[0])
    };

    return { state, cropper };
  },

  props: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
  emits: ['selectedPicture']
};
</script>

<style scoped lang="scss">
.pic-form {
  display: flex;
  justify-content: center;
  align-content: center;
}

img{
  visibility: hidden;
}
</style>
