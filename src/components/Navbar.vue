<template>
  <nav>
    <v-app-bar dark app height="80">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="toolbar-title">
        <router-link @click.native="scrollToTop" to="/">
          <span class="font-weight-light">Parcel</span><span class="font-weight-heavy">King</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        text
        v-for="btn in navButtons"
        :key="btn.text"
        :class="[btn.class, {'signin-btn' : btn.text == 'Sign In'}]"
        router
        :to="btn.text == 'Sign In' || btn.text == 'Logout' ? undefined : btn.route"
        @click="btn.text == 'Sign In' ? signInDialog() : undefined; btn.text=='Logout' ? onSignOut() : undefined"
        exact
      >
        <span>{{ btn.text }}</span>
        <v-icon right>{{ btn.icon }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <div class="app-list">
        <v-row v-if="isAuthenticated" class="mt-5" justify="center" style="max-height: 200px;">
          <v-col cols="12" class="d-flex justify-center">
            <v-avatar size="120" class="avatar" @click="redirect">
              <img :src="picture != null ? picture : 'https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png'" >
            </v-avatar>
          </v-col>
          <p class="avatar-text">Welcome, {{ username }} !</p>
        </v-row>
        <v-list-item
          v-for="(link, index) in alternateNav"
          :key="link.text + index"
          @click="link.text == 'Sign In' ? signInDialog() : undefined; link.text == 'Logout' ? onSignOut() : undefined"
          class="item"
          :class="{ 'last-item': link.text == 'Logout' }"
          router
          :to="link.text == 'Sign In' ? undefined : link.route"
          v-if="link.text == 'Logout' ? isAuthenticated : true"
        >
          <v-list-item-action>
            <v-icon class="black--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <SignInDialog :showDialog="dialog" />
    </v-navigation-drawer>
  </nav>
</template>
<script>
import { eventBus } from "../main";
import SignInDialog from "@/components/SignIn-Dialog";
import firebase from "../firebase"

export default {
  components: {
    SignInDialog,
  },
  computed: {
    picture() {
      return this.$store.getters.user.profilePicture;
    },
    username() {
      return this.$store.getters.user.username;
    },
    navButtons() {
      let navButtons = [
        {
          text: "Track & Trace",
          icon: "mdi-package-variant-closed",
          route: "/#track",
          class: "btn hidden-xs-only",
        },
        {
          text: "Sign In",
          icon: "mdi-account-box-outline",
          route: "",
          class: "btn hidden-xs-only",
        },
        {
          text: "Sign Up",
          icon: "mdi-account-circle-outline",
          route: "/signup"
        },
        {
          text: "Contact",
          icon: "mdi-email-multiple-outline",
          route: "/#contact",
          class: "hidden-sm-and-down",
        },
      ];

      if(this.isAuthenticated) {
        navButtons = [
        {
          text: "Track & Trace",
          icon: "mdi-package-variant-closed",
          route: "/#track",
          class: "btn hidden-xs-only",
        },
        {
          text: "Contact",
          icon: "mdi-email-multiple-outline",
          route: "/#contact",
          class: "hidden-xs-only",
        },
        {
          text: "Logout",
          icon: "mdi-logout",
          class: "navbar-logout"
        },
      ];
      }

      return navButtons;
    },
    isAuthenticated() {
      return (
        this.$store.getters.user != null &&
        this.$store.getters.user != undefined
      );
    }
  },
  data() {
    return {
      dialog: false,
      drawer: false,
      alternateNav: [
        {
          text: "Account",
          icon: "mdi-account-cog-outline",
          route: "/account",
        },
        {
          text: "Logout",
          icon: "mdi-logout",
        },
      ],
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    signInDialog() {
      this.dialog = true;
      eventBus.$emit("displayDialog", this.dialog);
    },
    onSignOut() {
      this.$store.dispatch('logout')
      eventBus.$emit('logout');
    },
    redirect() {
      if(this.$router.currentRoute.path != '/account') {
        this.$router.push('account')
      }
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', user)
      }
    })
  },
  mounted() {
    window.onresize = () => {
      eventBus.$emit("windowSizeChanged", window.innerWidth);
      if (window.innerWidth < 600 && this.alternateNav.length <= 2) {
        this.navButtons.forEach((btn) => {
          if (btn.text == "Track & Trace") {
            this.alternateNav.splice(0, 0, btn);
          } else if (btn.text == "Sign Up") {
            this.alternateNav.splice(2, 0, btn);
          } else if (btn.text == "Sign In") {
            this.alternateNav.splice(1, 0, btn);
          } else if (btn.text == "Contact") {
            this.alternateNav.splice(this.alternateNav.length - 2, 0, btn);
          }
        });
      }

      if (window.innerWidth > 600 && this.alternateNav.length > 2) {
        this.alternateNav = this.alternateNav.filter((nav) => {
          return (
            nav.text != "Sign Up" &&
            nav.text != "Track & Trace" &&
            nav.text != "Contact" &&
            nav.text != "Sign In"
          );
        });
      }
    },
    eventBus.$on('login', () => {
      if(this.alternateNav.length > 2) {
        this.alternateNav = this.alternateNav.filter((nav) => {
          return (
            nav.text != "Sign Up" &&
            nav.text != "Sign In"
          );
        });
        this.drawer = false;
      }
    }),
    eventBus.$on('logout', () => {
      if((window.innerWidth < 600)) {
        this.alternateNav.splice(1, 0, {
          text: "Sign In",
          icon: "mdi-account-box-outline",
          route: "",
          class: "btn hidden-xs-only",
        })
      }
    })
  },
};
</script>

<style scoped>
.toolbar-title a {
  color: white;
}

.btn {
  margin: 5px;
}

.app-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100% - 10px);
}

.item {
  max-height: 48px !important;
}

.last-item {
  margin-top: auto;
}

.signin-btn span, .navbar-logout {
  margin-top: -1.9px;
}

.avatar-text {
  width: 200px;
  margin: 0 auto;
  font-family: cursive;
  text-align: center;
}

.avatar:hover {
  cursor: pointer;
}

@media screen and (max-width: 750px) {
  .toolbar-title {
    display: none;
  }
}

@media screen and (max-width: 599px) {
  .toolbar-title {
    display: block;
  }
}
</style>