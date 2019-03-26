<template>
  <div>
   <input type="text" class="todo-input" placeholder="What needs to be done" v-model="newTodo" @keyup.enter="addTodo"/>
   <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
    <todo-item v-for="(todo , index) in todosFiltered" :key="todo.id" :todo="todo"  :index="index" :checkAll="!anyRemaining" @removedTodo="removeTodo(index)" @finishedEdit="finishedEdit">
    </todo-item>
   </transition-group>
   <div class="extra-container">
     <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos"/>Check All</label></div>
     <div>{{remaining}} items left</div>
   </div>
   <div class="extra-container">
     <div>
      <button :class="{active:filter =='all'}" @click="filter='all'">All</button>
      <button :class="{active:filter =='active'}" @click="filter='active'">Active</button>
      <button :class="{active:filter =='completed'}" @click="filter='completed'">Completed</button>
     </div>
     <div>
       <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
     </div>
   </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem';
export default {
  name: 'TodoComponent',
  components:{
    TodoItem,
  },
  data () {
    return {
     newTodo:'',
     idForTodo:3,
     editing:false,
     completed:false,
     beforeEditCache:'',
     filter:'all',
     todos:[
       {
       'id':1,
       'title':'Finish Vue Screencast',
       'completed':false,
       'editing':false,
       },
       {
       'id':2,
       'title':'Take over world.',
       'completed':false,
       'editing':false,
       }
     ]
    }
  },
  computed:{
    remaining(){
      return this.todos.filter(todo=>!todo.completed).length;
    },
    anyRemaining(){
      return this.remaining != 0
    },
    todosFiltered(){
      if(this.filter =='all'){
        return this.todos;
      }else if(this.filter=='active'){
        return this.todos.filter(todo=>!todo.completed)
      }else if(this.filter=='completed'){
        return this.todos.filter(todo=>todo.completed)
      }
      return this.todos;
    },
    showClearCompletedButton(){
       return this.todos.filter(todo=>todo.completed).length >0;
    }

  },
  methods:{
     addTodo(){
       if(this.newTodo.trim() ==0){
         alert("To-do needs a title.")
         return
       }

       this.todos.push({
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
     removeTodo(index){
       this.todos.splice(index,1);
     },
     finishedEdit(data){
       this.todos.splice(data.index,1,data.todo);
     },
     checkAllTodos(){
       this.todos.forEach((todo)=>todo.completed = event.target.checked)
     },
     clearCompleted(){
        this.todos = this.todos.filter(todo=> !todo.completed);
     }
  }
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
</style>
