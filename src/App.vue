<template>
  <div id="nav">
    
  </div>
  <router-view/>
</template>

<style>
@import '../node_modules/primevue/resources/themes/mdc-dark-indigo/theme.css';
@import '../node_modules/primevue/resources/primevue.min.css';
@import '../node_modules/primeicons/primeicons.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  background-color: #121212
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
