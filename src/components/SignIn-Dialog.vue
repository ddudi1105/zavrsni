<template>
  <div class="text-center">
    <v-dialog v-model="show" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">Sign In</v-card-title>
        <v-form ref="signin" @submit.prevent="onSignin" lazy-validation class="dialog-login">
          <v-text-field
            id="signInEmail"
            v-model="email"
            label="Email"
            name="Email-SignIn"
            append-icon="mdi-email"
            type="text"
            color="black"
            :rules="emailRules"
          />
          <v-text-field
            id="password"
            v-model="password"
            label="Password"
            name="Password"
            append-icon="mdi-lock"
            type="password"
            color="black"
            :rules="passwordRules"
          />
          <router-link
            to="/signup"
            tag="p"
            class="mt-3 overline no-text-decoration signup-link"
            @click.native="closeDialog"
          >
            <span style="height:100%;">Don't have an account ? Sign up now !</span>
          </router-link>
          <auth-alert />
          <v-btn :loading="isLoading" color="black" class="mb-3" dark type="submit">Sign In</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { eventBus } from "../main";
import authAlert from '../components/AuthAlert'

export default {
  props: {
    showDialog: {
      type: Boolean,
    },
  },
  components: {
    authAlert
  },
  computed: {
    isLoading() {
      return this.$store.getters.loading;
    }
  },
  data: () => {
    return {
      show: this.showDialog,
      email: null,
      password: null,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 5) || "Password must have 5+ characters",
        //(v) => /(?=.*[A-Z])/.test(v) || "Must have one uppercase character",
      ],
    };
  },
  methods: {
    closeDialog() {
      this.$refs.signin.reset();
      eventBus.$emit("displayDialog", false);
    },
    async onSignin(e) {
      if (!this.$refs.signin.validate()) {
        e.preventDefault();
      } else {
        eventBus.$emit("login");
        const error = await this.$store.dispatch("signUserIn", {
          email: this.email,
          password: this.password,
        });
        this.$refs.signin.reset();
        if(error != -1) { 
          eventBus.$emit("displayDialog", false);
        }
      }
    },
  },
  created() {
    eventBus.$on("displayDialog", (displayDialog) => {
      this.show = displayDialog;
    });
  },
  watch: {
    show() {
      this.$store.dispatch('clearAuthError');
    }
  }
};
</script>

<style scoped>
.dialog-login {
  max-width: 80%;
  text-align: center;
  margin: 0 auto;
  padding: 15px;
}

.signup-link:hover {
  cursor: pointer;
  width: 100%;
}

@media only screen and (max-width: 400px) {
  .signup-link {
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>