import App from './App'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import landingPage from './components/layouts/landingPage'
import aboutPage from "./components/layouts/aboutPage"
import testTodo from "./components/layouts/testTodo"
const routes =[
   {
     path:'/',
     name:'home',
     component:landingPage
   },
   {
     path:'/todo',
     name:'todo',
     component:App
   },
   {
     path:'/About',
     name:"about",
     component:aboutPage
   },
   {
     path:'/Login',
     name:"login",
     component:Login
   },
   {
     path:'/Register',
     name:"register",
     component:Register
   },
   {
     path:'/todos/:id',
     name:'todos',
     component:testTodo
   }
]

export default routes
