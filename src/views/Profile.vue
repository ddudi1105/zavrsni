<template>
  <div style="display: flex: justify-content: center; align-items: center">
    <v-card class="text--center pa-9 card">
      <div>
        <v-avatar size="230" class="avatar">
          <img
            :src="picture != null ? picture : 'https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png'"
          />
        </v-avatar>
      </div>
      <p class="ma-5 title">Welcome, {{ displayName }} !</p>
      <v-btn class="btn-profile" router to="/account/trackings">
        <v-icon class="profile-icon" small>fa-star</v-icon>
        <span>Your Trackings</span>
      </v-btn>
      <br />
      <v-btn class="btn-profile" @click="editProfile">
        <v-icon class="profile-icon" small>fa-cog</v-icon>
        <span>Edit Profile</span>
      </v-btn>
      <div v-if="edit" class="edit">
        <v-form ref="editProfileForm" @submit.prevent="updateProfile">
          <v-text-field
            v-for="setting in profileSettings"
            :key="setting.id"
            v-model="profile[setting.model]"
            :id="setting.id"
            :label="setting.label"
            :name="setting.name"
            :append-icon="setting.icon"
            :type="setting.type"
            outlined
            color="black"
            :rules="setting.model == 'username' || setting.model == 'email' ? userRules : undefined"
          />
          <v-btn :loading="loading" type="submit" class="mb-7" dark>Update Profile</v-btn>
        </v-form>
      </div>
      <v-btn class="btn-profile" @click="onSignOut">
        <v-icon class="profile-icon">mdi-logout</v-icon>
        <span>Logout</span>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  computed: {
    displayName() {
      return this.$store.getters.user.username;
    },
    picture() {
      return this.$store.getters.user.profilePicture;
    }
  },
  data() {
    return {
      edit: false,
      loading: false,
      profileSettings: [
        {
          id: "username",
          model: "username",
          label: "Username",
          name: "Username",
          icon: "mdi-account",
          type: 'text'
        },
        {
          id: "email",
          model: "email",
          label: "Email",
          name: "Email",
          icon: "mdi-email",
          type: 'email'
        },
        {
          id: "new-password",
          model: "newPassword",
          label: "New Password",
          name: "newPassword",
          icon: "mdi-lock",
          type: 'password'
        },
        {
          id: "phone-number",
          model: "phoneNumber",
          label: "Phone Number",
          name: "PhoneNumber",
          icon: "mdi-phone",
          type: 'text'
        },
        {
          id: "profile-picture",
          model: "profilePicture",
          label: "Profile Picture URL",
          name: "ProfilePicture",
          icon: "far fa-image",
          type: 'text'
        },
      ],
      profile: {
        username: null,
        email: null,
        phoneNumber: null,
        profilePicture: null,
        newPassword: null
      },
      userRules: [
        (v) => !!v || "This field is required",
        (v) => (v && v.length >= 5) || "Minimum length is 5 letters",
      ],
    };
  },
  methods: {
    async editProfile() {
      let userProfile = await firebase.auth().currentUser;
      this.profile.username = userProfile.displayName;
      this.profile.email = userProfile.email;
      this.profile.phoneNumber = userProfile.phoneNumber;
      this.profile.profilePicture = userProfile.photoURL;
      this.edit = !this.edit;
    },
    async updateProfile() {
      if (this.$refs.editProfileForm.validate()) {
        this.loading = true;
        let user = await firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: this.profile.username,
            photoURL: this.profile.profilePicture,
          })
          .then(() => {
            console.log(firebase.auth().currentUser);
            this.$store.commit("setUser", {
              id: user.uid,
              username: user.displayName,
              profilePicture: user.photoURL
            });
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });

          if(this.profile.email != user.email) {
            console.log(user.email);
            user.updateEmail(this.profile.email)
            .then(() => {})
            .catch(err => console.log(err));
          }
          
          if(this.profile.newPassword != null) {
              user.updatePassword(this.profile.newPassword)
                .then(() => console.log('updated'))
                .catch(err => console.log(err));
          }
      }
    },
    onSignOut() {
      this.$store.dispatch('logout')
    },
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', user);
      }
    });
  },
};
</script>

<style scoped>
.btn-profile {
  margin: 20px auto;
  width: 50%;
}

.card {
  text-align: center;
  width: 70%;
  margin: 100px auto;
}

.profile-icon {
  margin-right: 15px;
  width: 30px;
}

.btn-profile span {
  min-width: 130px;
}

.edit {
  width: 50%;
  margin: 0 auto;
}

@media screen and (max-width: 790px) {
  .btn-profile {
    width: 85%;
  }

  .edit {
    width: 85%;
  }
}

@media only screen and (max-width: 790px) {
  .card {
    width: 90%;
  }

  .btn-profile {
    width: 95%;
  }

  .edit {
    width: 95%;
  }
}
</style>