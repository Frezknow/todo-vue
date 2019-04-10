import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import db from '../firebase'
Vue.use(Vuex)
axios.defaults.baseURL="http://127.0.0.1:8000/api/";
export const store = new Vuex.Store({
  state:{
    filter:'all',
    loading:true,
    token:localStorage.getItem('access_token') || null,
    todos:[
      // {
      // 'id':1,
      // 'title':'Finish Vue Screencast',
      // 'completed':false,
      // 'editing':false,
      // },
      // {
      // 'id':2,
      // 'title':'Take over world.',
      // 'completed':false,
      // 'editing':false,
      // }
    ]
  },
  getters:{
    remaining(state){
      return state.todos.filter(todo=>!todo.completed).length;
    },
    anyRemaining(state,getters){
      return getters.remaining != 0
    },
    todosFiltered(state){
      if(state.filter =='all'){
        return state.todos;
      }else if(state.filter=='active'){
        return state.todos.filter(todo=>!todo.completed)
      }else if(state.filter=='completed'){
        return state.todos.filter(todo=>todo.completed)
      }
      return state.todos;
    },
    showClearCompletedButton(state){
       return state.todos.filter(todo=>todo.completed).length >0;
    }
  },
  mutations:{
     addTodo(state,todo){
        state.todos.push({
           id:todo.id,
           title:todo.title,
        })
     },
     clearCompleted(state){
       return state.todos = state.todos.filter(todo=> !todo.completed);
     },
     updateFilter(state,filter){
        state.filter =filter
     },
     checkAll(state,checked){
       state.todos.forEach((todo)=>todo.completed = checked)
     },
     deleteTodo(state,id){
       const index = state.todos.findIndex(item => item.id == id);
       if(index>=0){
         state.todos.splice(index,1);
       }
     },
     updateTodo(state,todo){
      const index = state.todos.findIndex(item => item.id == todo.id);
       state.todos.splice(index,1,{
         'id':todo.id,
         'title':todo.title,
         'completed':todo.completed,
         'editing':todo.editing,
       })
     },
     retrieveTodos(state,todos){
         state.todos = todos
     },
     retrieveToken(state,token){
         state.token = token
     }
  },
  actions:{
    retrieveToken(context,credentials){
     return new Promise((resolve, reject)=>{
      axios.post('/login',{
        username:credentials.username,
        password:credentials.password,
      })
      .then(response=>{
         console.log(response)
         const token = response.data.access_token

         localStorage.setItem('access_token',token)
         context.commit('retrieveToken',token)
         resolve(response)
      }).catch(error=>{
         console.log(error)
         reject(error)
      })
     })
   },
    initRealtimeListeners(context){
      db.collection("todos")
       .onSnapshot(snapshot =>{
        snapshot.docChanges().forEach(change=> {
            if (change.type === "added") {
                console.log("Added: ", change.doc.data());
                const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                if(source==='Server'){
                context.commit('addTodo',{
                  id:change.doc.id,
                  title:change.doc.data().title,
                  completed:false,
                })
              }
            }
            if (change.type === "modified") {
                console.log("Updated: ", change.doc.data());
                context.commit('updateTodo',{
                  id:change.doc.id,
                  title:change.doc.data().title,
                  completed:change.doc.data().completed
                })
            }
            if (change.type === "removed") {
                console.log("Removed: ", change.doc.data());
                context.commit('deleteTodo',change.doc.id)
            }
        });
    });
    },
     retrieveTodos(context){
        context.state.loading = true
       // db.collection('todos').get()
       // .then(querySnapshot=>{
       //   let tempTodos =[];
       //   querySnapshot.forEach(doc=>{
       //     const data ={
       //        id:doc.id,
       //        title:doc.data().title,
       //        completed:doc.data().completed,
       //        timestamp:doc.data().timestamp,
       //     }
       //     tempTodos.push(data)
       //   })
       //   context.state.loading = false
       //   const tempTodosSorted = tempTodos.sort((a,b)=>{
       //     return a.timestamp.seconds - b.timestamp.seconds
       //   })
       //   context.commit('retrieveTodos',tempTodosSorted)
       // })
       axios.get('/todos')
       .then(response=>{
         context.commit('retrieveTodos',response.data)
         context.state.loading = false
       }).catch(error=>{
         console.log(error)
       })
     },
     addTodo(context,todo){
       context.state.loading = true
       // db.collection('todos').add({
       //   title:todo.title,
       //   completed:false,
       //   timestamp: new Date(),
       // })
       // .then(docRef=>{
       //    context.commit('addTodo',{
       //      id:docRef.id,
       //      title:todo.title,
       //      completed:false,
       //      timestamp:new Date(),
       //    })
       //    context.state.loading= false
       // })
       axios.post('todos',{
         title:todo.title,
         completed:false,
       })
        .then(response => {
           context.commit('addTodo',response.data)
          context.state.loading = false
        })
        .catch(error => {
           console.log(error)
        })
     },
     clearCompleted(context){
       context.state.loading = true
       // db.collection('todos').where('completed','==',true).get()
       //  .then(querySnapshot=>{
       //     querySnapshot.forEach(doc=>{
       //       doc.ref.delete()
       //       .then(()=>{
       //          context.commit('clearCompleted');
       //          context.state.loading = false
       //       })
       //     })
       //  })

      const completed = store.state.todos
       .filter(todo => todo.completed)
       .map(todo => todo.id)

       axios.delete('todosDeleteCompleted',{
         data:{
           todos:completed
         }
       })
        .then(response => {
           context.commit('clearCompleted');
           context.state.loading = false
        })
        .catch(error => {
           console.log(error)
        })
     },
     updateFilter(context,filter){
      context.commit('updateFilter',filter);
     },
     checkAll(context,checked){
       // db.collection('todos').get()
       //  .then(querySnapshot=>{
       //    querySnapshot.forEach(doc=>{
       //       doc.ref.update({
       //          completed:checked
       //       })
       //       .then(()=>{
       //          context.commit('checkAll',checked);
       //       })
       //    })
       // })
       axios.patch('todosCheckAll',{
         completed:checked,
       })
        .then(response => {
           context.commit('checkAll',checked);
        })
        .catch(error => {
           console.log(error)
        })
     },
     deleteTodo(context,id){
       context.state.loading = true
       // db.collection('todos').doc(id).delete()
       //  .then(()=>{
       //     context.commit('deleteTodo',id);
       //     context.state.loading = false
       //  })
       axios.delete('todos/'+id)
        .then(response => {
           context.commit('deleteTodo',id);
           context.state.loading = false
        })
        .catch(error => {
           console.log(error)
        })

     },
     updateTodo(context,todo){
       context.state.loading = true
       // db.collection('todos').doc(todo.id).set({
       //   id:todo.id,
       //   title:todo.title,
       //   completed:todo.completed,
       // },{merge:true}).then(()=>{
       //   context.commit('updateTodo',todo);
       //   context.state.loading = false
       // })
       axios.patch('todos/'+todo.id,{
         title:todo.title,
         completed:todo.completed,
       })
        .then(response => {
          context.commit('updateTodo',todo);
           context.state.loading = false
        })
        .catch(error => {
           console.log(error)
        })
     }
  }
})
