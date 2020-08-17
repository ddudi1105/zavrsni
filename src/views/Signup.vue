<template>
  <v-container id="signinup-form" class="fill-height">
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="12" sm="8" md="8" class>
        <auth-alert />
        <v-card class="evelation-12 card">
          <v-window transition="slide-x-transition" v-model="step">
            <!--SignIn-->
            <v-window-item :value="2">
              <v-row class>
                <v-col cols="12" md="8" class="pt-6 pb-6">
                  <v-card-text>
                    <v-form ref="signin" @submit.prevent="onSignin">
                      <h1 class="text-center display-1 mb-10" :class="`${bgColor}--text`">Sign in</h1>
                      <v-text-field
                        id="signInEmail"
                        v-model="emailSignIn"
                        label="Email"
                        name="Email-SignIn"
                        append-icon="mdi-email"
                        type="text"
                        :color="bgColor"
                        :rules="emailRules"
                      />
                      <v-text-field
                        id="signinPassword"
                        v-model="passwordSignIn"
                        label="Password"
                        name="Password-SignIn"
                        append-icon="mdi-lock"
                        type="password"
                        :color="bgColor"
                        :rules="passwordRules"
                      />
                      <div class="text-center">
                        <a
                          href="#"
                          class="mt-3 overline no-text-decoration"
                          :class="`${bgColor}--text`"
                          @click="step = 3"
                        >Forgot your password?</a>
                      </div>
                      <div class="text-center mt-6">
                        <v-btn
                          :loading="isLoading"
                          type="submit"
                          large
                          :color="bgColor"
                          dark
                        >Sign In</v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="4" class="darken-2 vcenter" :class="`${bgColor}`">
                  <div>
                    <v-card-text :class="`${fgColor}--text`">
                      <h1 class="text-center headline mb-3">No User?</h1>
                      <h5 class="text-center overline mb-3">Please Sign Up to continue</h5>
                    </v-card-text>
                    <div class="text-center mb-6">
                      <v-btn
                        dark
                        outlined
                        @click="step = 1; $store.dispatch('clearAuthError')"
                      >Sign Up</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <!--SignUp-->
            <v-window-item :value="1">
              <v-row class="fill-height">
                <v-col cols="12" md="4" class="darken-2 vcenter" :class="`${bgColor}`">
                  <div>
                    <v-card-text :class="`${fgColor}--text`">
                      <h1 class="text-center headline mb-3">Already a user?</h1>
                      <h5 class="text-center overline mb-3">Please Sign In</h5>
                    </v-card-text>
                    <div class="text-center mb-6">
                      <v-btn
                        dark
                        outlined
                        @click="step = 2;  $store.dispatch('clearAuthError')"
                      >Sign In</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="pt-6 pb-6">
                  <v-card-text class="text-center">
                    <h1 class="text-center display-1 mb-10" :class="`${bgColor}--text`">Sign Up</h1>
                    <v-form ref="signup" @submit.prevent="onSignup" lazy-validation>
                      <v-text-field
                        id="username"
                        v-model="username"
                        label="Username"
                        name="username"
                        append-icon="mdi-account"
                        type="text"
                        color="black"
                        :rules="usernameRules"
                      />
                      <v-text-field
                        id="signUpEmail"
                        v-model="emailSignUp"
                        label="Email"
                        name="Email-Signup"
                        append-icon="mdi-email"
                        type="email"
                        color="black"
                        :rules="emailRules"
                      />
                      <v-text-field
                        id="signUpPassword"
                        v-model="passwordSignUp"
                        label="Password"
                        name="Password-SignUp"
                        append-icon="mdi-lock"
                        type="password"
                        color="black"
                        :rules="passwordRules"
                      />
                      <v-text-field
                        id="password-confirm-signup"
                        v-model="confirmPassword"
                        label="Confirm Password"
                        name="password-confirm"
                        append-icon="mdi-lock"
                        type="password"
                        color="black"
                        :rules="[(v) => !!v || 'You must confirm password', passwordSignUp == confirmPassword || 'Passwords must match']"
                      />
                      <div class="text-center mt-6">
                        <v-btn
                          :loading="isLoading"
                          type="submit"
                          large
                          :color="bgColor"
                          dark
                        >Sign Up</v-btn>
                      </div>
                    </v-form>
                    <v-divider style="width: 80%; margin: 20px auto;"></v-divider>
                    <div class="social-signin">
                      <v-btn outlined color="blue" class="social-btn" @click="googleSignIn">
                        <div
                          style="width: 95%; display: flex; align-items: center; justify-content: space-between;"
                        >
                          <img
                            src="https://cloud.digitalocean.com/registrations/new/static/media/oauth-logo-google.c5ac4cab.svg"
                            alt
                          />
                          Sign In With Google
                        </div>
                      </v-btn>
                      <v-btn outlined color="white" class="social-btn face">
                        <div
                          style="width: 95%; display: flex; align-items: center; justify-content: space-between;"
                        >
                          <img src="https://www.facebook.com/rsrc.php/v3/yN/r/szGrb_tkxMW.png" alt />
                          Sign In With Facebook
                        </div>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
            <!--PW Rest-->
            <v-window-item :value="3">
              <v-row class="fill-height">
                <v-col cols="12" md="4" class="darken-2 vcenter" :class="`${bgColor}`">
                  <div>
                    <v-card-text :class="`${fgColor}--text`">
                      <h1 class="text-center headline mb-3">Already a user?</h1>
                      <h5 class="text-center overline mb-3">Please Sign In</h5>
                    </v-card-text>
                    <div class="text-center mb-6">
                      <v-btn dark outlined @click="step = 2">Sign In</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="pt-6 pb-6">
                  <v-card-text>
                    <v-form @submit.prevent="onForgotPassword">
                      <h1
                        class="text-center display-1 mb-10"
                        :class="`${bgColor}--text`"
                      >Reset Password</h1>
                      <v-text-field
                        id="forgotPassword"
                        v-model="forgotPasswordEmail"
                        label="Email"
                        name="forgotPassword"
                        append-icon="mdi-email"
                        type="email"
                        :color="bgColor"
                        class="v-input__icon--double"
                        :rules="emailRules"
                      />
                      <div class="text-center mt-6">
                        <v-btn large :color="bgColor" dark type="submit">Reset Password</v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import * as firebase from "firebase";
import { eventBus } from "../main";
import authAlert from "../components/AuthAlert";

export default {
  props: {
    source: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "black",
    },
    fgColor: {
      type: String,
      default: "white",
    },
  },
  components: {
    authAlert,
  },
  data: () => ({
    step: 1,
    username: "",
    emailSignIn: "",
    passwordSignIn: "",
    emailSignUp: "",
    passwordSignUp: "",
    confirmPassword: "",
    forgotPasswordEmail: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    usernameRules: [
      (v) => !!v || "Username is required",
      (v) => (v && v.length >= 5) || "Username must be at least 5 characters",
      (v) => v != "RandomName" || "Username already exists",
      (v) =>
        /^[a-zA-Z0-9]*$/.test(v) ||
        "Username can contain only characters and numbers",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must have 5+ characters",
      //(v) => /(?=.*[A-Z])/.test(v) || "Must have one uppercase character",
    ],
    usernameRulesLogin: [
      (v) => !!v || "Username is required",
      (v) => (v && v.length >= 5) || "Username must be at least 5 characters",
      (v) =>
        /^[a-zA-Z0-9]*$/.test(v) ||
        "Username can contain only characters and numbers",
    ],
  }),
  methods: {
    googleSignIn() {
      let provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          console.log(user.photoURL);
          this.$store.commit('setUser', {
            id: user.uid,
            username: user.displayName,
            profilePicture: user.photoURL,
            trackings: [],
        });
          // ...
        })
        .catch(err => {
          console.log(err);
        })
    },
    onSignup(e) {
      if (!this.$refs.signup.validate()) {
        e.preventDefault();
      } else {
        this.$store.dispatch("signUserUp", {
          email: this.emailSignUp,
          password: this.passwordSignUp,
          username: this.username,
        });
        this.$refs.signup.reset();
      }
    },
    onSignin(e) {
      if (!this.$refs.signin.validate()) {
        e.preventDefault();
      } else {
        eventBus.$emit("login");
        console.log(this.emailSignIn);
        this.$store.dispatch("signUserIn", {
          email: this.emailSignIn,
          password: this.passwordSignIn,
        });
        this.$refs.signin.reset();
      }
    },
    async onForgotPassword() {
      await firebase.auth().sendPasswordResetEmail(this.forgotPasswordEmail)
        .then(() => {
          console.log('sent');
        })
        .catch(err => console.log(err));
      this.$router.replace({name: 'Home' });
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isLoading() {
      return this.$store.getters.loading != false;
    },
  },
  watch: {
    user(value) {
      if (value != null && value != undefined) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.social-signin {
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.social-btn {
  width: 53%;
  padding: 20px 16px !important;
}

.social-btn.face {
  background-color: #1877f2;
}

@media screen and (min-width: 300px) and (max-width: 700px) {
  .social-btn {
    width: 60%;
  }
}

@media screen and (min-width: 300px) and (max-width: 400px) {
  .social-btn {
    width: 90%;
  }
}

@media screen and (min-width: 400px) and (max-width: 500px) {
  .social-btn {
    width: 80%;
  }
}

@media screen and (min-width: 450px) and (max-width: 500px) {
  .social-btn {
    width: 70%;
  }
}

@media screen and (min-width: 300px) and (max-width: 350px) {
  .social-btn {
    width: 100%;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .social-btn {
    width: 60%;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1300px) {
  .social-btn {
    width: 80%;
  }
}

@media screen and (min-width: 280px) and (max-width: 320px) {
  .social-btn {
    width: 100%;
  }
}

@media screen and (min-width: 1219px) and (max-width: 1400px) {
  .social-btn {
    width: 60%;
  }
}

@media screen and (min-width: 953px) and (max-width: 999px) {
  .social-btn {
    width: 80%;
  }
}

@media screen and (min-width: 600px) and (max-width: 750px) {
  .social-btn {
    width: 70%;
  }
}
</style>

