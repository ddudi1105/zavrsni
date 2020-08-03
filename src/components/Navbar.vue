<template>
  <nav>
    <v-app-bar dark app height='80'>
      <v-app-bar-nav-icon @click='drawer = !drawer'></v-app-bar-nav-icon>

      <v-toolbar-title class='toolbar-title'>
        <router-link @click.native="scrollToTop" to="/">
          <span class='font-weight-light'>Parcel</span><span class='font-weight-heavy'>King</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        text
        v-for='btn in navButtons'
        :key='btn.text'
        :class='btn.class'
        router :to='btn.route'
        exact
      >
        <span>{{ btn.text }}</span>
        <v-icon right>{{ btn.icon }}</v-icon>
      </v-btn>
    </v-app-bar>

      <v-navigation-drawer v-model='drawer' app temporary>
        <div class="app-list">
          <v-list-item 
            v-for='(link, index) in alternateNav' 
            :key='link.text'
            class="item"
            :class="{ 'last-item': index == (alternateNav.length - 1) }"
            route :to='link.route'>
              <v-list-item-action>
                <v-icon class='black--text'>{{ link.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ link.text }}</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </div>
      </v-navigation-drawer>
  </nav>

</template>
<script>
import { eventBus } from '../main'

export default {
  data() {
    return {
      navButtons: [
        {
          text: 'Track & Trace',
          icon: 'mdi-package-variant-closed',
          route: '/#track',
          class: 'btn hidden-xs-only'
        },
        {
          text: 'Sign Up',
          icon: 'mdi-account-circle-outline',
          route: '/signup',
          class: 'btn hidden-xs-only'
        },
        {
          text: 'Contact',
          icon: 'mdi-email-multiple-outline',
          route: '/#contact',
          class: 'btn hidden-xs-only'
        }
      ],
      drawer: false,
      alternateNav: [
        {
          text: 'Sign In',
          icon: 'mdi-account-box-outline',
          route: '/signin'
        },
        {
          text: 'Account',
          icon: 'mdi-account-cog-outline',
          route: '/user/profile'
        },
        {
          text: 'Logout',
          icon: 'mdi-logout',
          route: '/logout'
        },
      ],
      windowWidth: window.innerWidth
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  },
  mounted() {
    window.onresize = () => {
      eventBus.$emit('windowSizeChanged', window.innerWidth);
      if(window.innerWidth < 600 && this.alternateNav.length <= 3) {
        this.navButtons.forEach(btn => {
          if(btn.text == 'Track & Trace') {
            this.alternateNav.splice(0, 0, btn);
          } else if (btn.text == 'Sign Up') {
            this.alternateNav.splice(1, 0, btn)
          } else {
            this.alternateNav.splice((this.alternateNav.length - 1), 0, btn)
          }
        })
      }

      if(window.innerWidth > 600 && this.alternateNav.length > 3) {
        this.alternateNav = this.alternateNav.filter(nav => {
          return (nav.text != 'Sign Up') && (nav.text != 'Track & Trace') && (nav.text != 'Contact');
        })
      }
    }
  }
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