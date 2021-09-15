<template>
  <div>
    <CreateAccountForm/>
    <!-- <LoginForm /> -->
  </div>
</template>

<script>

// import LoginForm from '@/components/LoginForm.vue'
import CreateAccountForm from '@/components/CreateAccountForm.vue'

export default {
  name: 'Home',
  components: {
    CreateAccountForm
    // LoginForm
  }
  
}
</script>
