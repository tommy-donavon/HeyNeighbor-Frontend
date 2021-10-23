<template>
<MaintenanceForm />

</template>

<script>
import MaintenanceForm from "../components/MaintenanceForm.vue"
import {ref} from 'vue'
export default {
    name: "MaintenanceDash",
    setup(){
        const infoVisable = ref(false)
        const ToggleInfoVisable = () => {
            infoVisable.value = !infoVisable.value
        }
        return {
            infoVisable,
            ToggleInfoVisable
        }
    },
    components:{
        MaintenanceForm
    }

}
</script>

<style>

</style>