<template>
  <div class="bookmarks">
    <p class="bookmark-title">Bookmarks</p>
    <v-text-field
      v-model="trackNum"
      label="Tracking Number"
      :outlined="true"
      :clearable="true"
      class="track-field"
      @keyup.enter="trackPackage"
    ></v-text-field>
    <div v-if="carriersNames.length >= 1" class="select-carrier">
      <v-select
        v-model="selectedCarrier"
        :items="carriersNames"
        label="Select Carrier"
        class="select-itm"
      />
    </div>
    <v-alert class="error-alert" v-if="error" type="error">
      {{ error }}
    </v-alert>
    <v-btn
      :loading="loading"
      :disabled="trackNum === ''"
      color="orange"
      class="white--text"
      @click="carriersNames.length >= 1 ? onBookmarkWithCarrier() : onBookmark()"
      v-if="carriersNames.length >= 1 ? (selectedCarrier != null) : true"
    >Add To Bookmarks</v-btn>
    <v-divider class="ma-11"></v-divider>
    <v-alert
      type="info"
      class="info-alert"
      v-if="trackings.length == 0"
    >You have no saved trackings.</v-alert>

    <div v-if="trackings">
      <Steps
        v-for="(tracking, index) in trackings"
        :key="tracking.tracking_number + index"
        :tracked="tracking"
        :showDetails="false"
        :removable="true"
        class="step-item"
        @removeTracking="onRemoveTracking"
      />
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";
import * as api from "../functions/api";
import Steps from '../components/Steps'
const trackingDoc = firebase.firestore().collection("trackings");

export default {
  components: {
    Steps
  },
  data() {
    return {
      trackNum: "",
      error: '',
      loading: false,
      carriersNames: [],
      carriersCodes: [],
      selectedCarrier: null
    };
  },
  computed: {
    trackings() {
      return this.$store.getters.userTrackings;
    },
    id() {
      return this.$store.getters.user.id;
    },
  },
  methods: {
    async onBookmark() {
      this.loading = true;

      if(this.error) {
        this.error = '';
      }

      const tracking = await api.trackPackage(this.trackNum);

      if(!tracking || tracking == undefined) {
        this.loading = false;
        this.error = 'Enter a valid tracking number';
        this.trackNum = '';
        return;
      }

      if (!Array.isArray(tracking)) {

        if(tracking.status == 'notfound') {
          this.error = 'Your shippment cannot be found. Try again later.'
          this.loading = false;
          this.trackNum = '';
          return;
        }

        await trackingDoc.add({
          id: this.id,
          tracking: tracking,
        });
        const user = firebase.auth().currentUser;
        this.$store.dispatch('updateUser', user);
        this.loading = false;
        this.trackNum = '';
        return;
      }

      tracking.forEach((carrier) => {
        this.carriersNames.push(carrier.name);
        this.carriersCodes.push(carrier.code);
      });
      this.loading = false;
      return;
    },
    async onBookmarkWithCarrier() {
      this.loading = true;
      const carrierCode = this.carriersCodes[this.carriersNames.indexOf(this.selectedCarrier)]
      const tracking = await api.trackWithCarrier(carrierCode, this.trackNum);

      if(tracking.status == 'notfound') {
        this.error = 'Your shippment cannot be found. Try again later.'
        this.loading = false;
        this.carriersNames = [];
        this.carriersCodes = [];
        this.selectedCarrier = '';
        this.trackNum = '';
        return;
      }
      
      await trackingDoc.add({
          id: this.id,
          tracking: tracking,
        });
      this.carriersNames = [];
      this.carriersCodes = [];
      this.selectedCarrier = '';
      this.loading = false;
      this.trackNum = '';
      const user = firebase.auth().currentUser;
      this.$store.dispatch('updateUser', user);
    },
    async onRemoveTracking(trackingNumber) {
      const user = await firebase.auth().currentUser;
      const trackingsQuery = await trackingDoc.where('id', '==', user.uid).get();
    
      trackingsQuery.forEach(doc => {
        if(doc.data().tracking.tracking_number === trackingNumber) {
          doc.ref.delete();
        }
      })

      //console.log(user)
      this.$store.dispatch('updateUser', user);
    }
  },
  mounted() {
    trackingDoc.onSnapshot(async (doc) => {
      let user = await firebase.auth().currentUser;
      this.$store.dispatch('updateUser', user);
    }),
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', user)
      }
    })
  }
};
</script>

<style scoped>
p.bookmark-title {
  font-family: cursive;
  font-size: 38px;
  margin: 45px auto;
}

.track-field {
  width: 50%;
  margin: 0 auto !important;
}

.bookmarks {
  text-align: center;
  margin-top: 30px;
}

.info-alert {
  width: 50%;
  margin: 20px auto;
}

.select-itm {
  width: 25%;
  margin: 0 auto;
}

.error-alert {
  width: 420px;
  margin: 0 auto;
  margin-bottom: 25px;
}

.step-item {
  width: 90%;
  margin: 30px auto;
  box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 30px;
}

@media screen and (max-width: 420px) {
  .track-field {
    width: 80%;
  }

  .info-alert {
    width: 80%;
  }
}

@media screen and (max-width: 600px) {
  .error-alert {
    width: 300px;
  }

  .select-itm {
    width: 50%;
    margin: 0 auto;
  }
}
</style>