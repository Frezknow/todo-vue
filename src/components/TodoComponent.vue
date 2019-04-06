<template>
  <div>
   <input type="text" class="todo-input" placeholder="What needs to be done" v-model="newTodo" @keyup.enter="addTodo"/>
   <div v-if="$store.state.loading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
   <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
    <todo-item v-for="(todo , index) in todosFiltered" :key="todo.id" :todo="todo"  :index="index" :checkAll="!anyRemaining">
    </todo-item>
   </transition-group>
   <div class="extra-container">
     <todo-check-all></todo-check-all>
     <todo-items-remaining :remaining="remaining"></todo-items-remaining>
   </div>
   <div class="extra-container">
     <todo-filtered></todo-filtered>
     <div>
      <transition name="fade">
       <todo-clear-completed></todo-clear-completed>
      </transition>
    </div>
   </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem';
import TodoItemsRemaining from './TodoItemsRemaining';
import TodoCheckAll from './TodoCheckAll';
import TodoFiltered from './TodoFiltered';
import TodoClearCompleted from './TodoClearCompleted';
export default {
  name: 'TodoComponent',
  components:{
    TodoItem,
    TodoItemsRemaining,
    TodoCheckAll,
    TodoFiltered,
    TodoClearCompleted,
  },
  data () {
    return {
     newTodo:'',
     idForTodo:3,
   }
  },
  computed:{
    anyRemaining(){
      return this.$store.getters.anyRemaining
    },
    todosFiltered(){
      return this.$store.getters.todosFiltered
    },

  },
  created(){
        this.$store.dispatch('initRealtimeListeners')
    this.$store.dispatch('retrieveTodos')
  },
  methods:{
     addTodo(){
       if(this.newTodo.trim() ==0){
         alert("To-do needs a title.")
         return
       }
       this.$store.dispatch('addTodo',{
         id:this.idForTodo,
         title:this.newTodo,
         beforeEditCache:'',
         completed:false,
         editing:false,
       })

       alert("To-do created.");
       this.newTodo="";
       this.idForTodo++
     },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
 @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
 .remove-item{
   cursor:pointer;
   margin-left:14px;
   &:hover{
     color:black;
   }
 }
 .todo-input {
   width:100%;
   padding:10px 18px;
   font-size:18px;
   margin-bottom:16px;
 }
 .todo-item{
   margin-bottom:12px;
   display:flex;
   align-items:center;
   justify-content:space-between;
   animation-duration:0.3s;
 }
 .todo-item-left{
   display:flex;
   align-items:center;
 }
 .todo-item-label{
   padding:10px;
   border:1px solid white;
   margin-left:12px;
 }
 .todo-item-edit{
   font-size:24px;
   color:#2c3e58;
   margin-left:12px;
   width:100%;
   padding:10px;
   border:1px solid #000;
   font-family:'Avenir',Helvetica,Arial,sans-serif;
   &:focus{
     outline:none;
   }
 }
 .completed{
   text-decoration:line-through;
   color:grey;
 }
 .extra-container{
    display:flex;
    align-items:center;
    justify-content:space-between;
    font-size:16px;
    border-top:1px solid lightgrey;
    padding-top:14px;
    margin-bottom:14px;
 }
 button{
   font-size:14px;
   background-color:white;
   appearance:none;
   a:hover{
      background:lightgreen;
   }
   a:focus{
      outline:none;
   }
 }
 .active{
   background:lightgreen;
 }
.fade-enter-active, .fade-leave-active{
  transition:opacity .2s;
}
.fade-enter, .fade-leave-to{
  opacity:0;
}
//css spinner
.lds-ring {
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
  margin:auto;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid grey;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
