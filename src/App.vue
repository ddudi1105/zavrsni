<template>
  <v-app>
    <app-Navbar></app-Navbar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <app-Footer></app-Footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    appNavbar: Navbar,
    appHome: Home,
    appFooter: Footer
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
