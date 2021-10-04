<template>
  <div class="dash-options">
    <Card
      style="width:25em;display:flex;flex-direction:column;align-items:center;justify-content:center;"
      @click="optFunction"
    >
      <template #header>
        <img
          alt="property header"
          :src="imgPath"
          style="height: 15rem"
        />
      </template>
      <template #title>
        <h3>{{optName}}</h3>
      </template>
      <!-- <template #footer style="">
        <Button label="GO" @click="optFunction" />
      </template> -->
    </Card>
  </div>
</template>

<script>
import {toRefs} from 'vue'
export default {
    name:'DashOptions',
    setup(props){
        const {optImg} = toRefs(props)
        const imgPath = `@/assets/${optImg.value}`
        return {
            imgPath
        }
    },
    props:{
        optImg: {
            type:String,
        },
        optName: {
            type: String,
            required: true,
        },
        optFunction: {
            type: Function,
            required: true,
        }
    }

}
</script>

<style lang="scss" scoped>
.dash-options{
  margin: 5%;
}
</style>