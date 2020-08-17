<template>
  <v-alert dismissible @input="onClose" v-if="authError" type="error">{{ authError }}</v-alert>
</template>

<script>
export default {
  computed: {
    authError() {
      return this.$store.getters.authError;
    }
  },
  methods: {
    onClose() {
      console.log('closing');
      this.$store.dispatch('clearAuthError');
    }
  }
}
</script>