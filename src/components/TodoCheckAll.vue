<template>
  <div>
    <label><input type="checkbox" :checked="!anyRemaining" @change="allChecked"/>Check All</label>
  </div>
</template>
<script>
export default{
 name:'todo-check-all',
 props:{
   anyremaining:{
      type:Boolean,
      required:true,
   }
 },
 methods:{
    allChecked(){
      eventBus.$emit('checkAllChanged',this.anyRemaining)
    }
 }
}
</script>
