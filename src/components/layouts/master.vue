<template>
 <div id="app">
   <ul class="nav">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/About">About</router-link></li>
      <li><router-link to="/Login">Login</router-link></li>
      <li><router-link to="/Register">Register</router-link></li>
      <li><router-link to="/todo">Todo</router-link></li>
   </ul>
      <router-view></router-view>
 </div>

</template>
<script>
export default{

}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size:24px;
}

</style>
