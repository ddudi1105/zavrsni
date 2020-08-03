<template>
  <div class="body">
    <div class="background">
      <h1 class="bkg-title">ParcelKing</h1>
      <p>Live Through Your Parcel's Journey</p>
      <router-link to="/signup" style="margin-top: 10px;">
        <v-btn width="180" x-large rounded>Sign Up !</v-btn>
      </router-link>
    </div>

    <section>
      <div class="app-list">
        <div v-for="listItem in appListItemsPrimary" :key="listItem.alt" class="app-list-item">
          <img :src="listItem.img" :alt="listItem.alt" />
          <h2>{{ listItem.title }}</h2>
          <p>{{ listItem.paragraph }}</p>
        </div>
      </div>
    </section>

    <section>
      <div class="cover">
        <h1>Around The World !</h1>
      </div>
    </section>

    <section>
      <div class="app-list">
        <div v-for="listItem in appListItemsSecondary" :key="listItem.alt" class="app-list-item">
          <img :src="listItem.img" :alt="listItem.alt" />
          <h2>{{ listItem.title }}</h2>
          <p>{{ listItem.paragraph }}</p>
        </div>
      </div>
    </section>

    <section>
      <div
        class="cover cover-2nd"
      >
        <h1>Utilize all our benefits by signing up for free</h1>
      </div>
    </section>

    <section id="sbs-sec">
      <div class="side-by-side">
        <img
          class="sbs-item img-1"
          src="@/assets/mobile-friendly-1.png"
          alt
        />
        <div class="sbs-item">
          <h3>Mobile Friendly</h3>
          <p>With the latest update all our features are available on your smartphones.</p>
        </div>
      </div>
      <hr v-if="windowUnder" />
      <div class="side-by-side">
        <div class="sbs-item">
          <h3>Custom Signing In</h3>
          <p>Proceed to sign in with your google account if you don't want to register a new one.</p>
        </div>
        <img
          class="sbs-item img-2"
          src="@/assets/mobile-friendly-2.png"
          alt
        />
      </div>
    </section>

    <section id="track">
      <div class="track-pkg">
        <h1>
          The World Leading
          <br />Package Tracking Solution
        </h1>
        <h3>Tracking support for hundreds of carriers worldwide</h3>
        <div class="tracking-box">
          <v-text-field
            v-model="trackNum"
            label="Tracking Number"
            :outlined="true"
            :clearable="true"
            class="track-field"
            @keyup.enter="trackPackage"
            ></v-text-field>
            <v-btn 
              @click="trackPackage" 
              color="orange" 
              dark 
              x-large 
              class="btn-track"
              :loading="loadingMain"
              :disabled="carriersNames.length >= 1">
              <v-icon left>mdi-package-variant-closed</v-icon>
              <span>Track</span>
            </v-btn>

          <div v-if="carriersNames.length >= 1" class="select-carrier"> 
             <v-select
                v-model="selectedCarrier"
                :items="carriersNames"
                label="Select Carrier"
                class="select-itm"
              >
              </v-select>
              <v-btn 
                class="select-btn" 
                :loading="loadingSelect"
                color="primary"
                @click="trackWithCarrier">Select & Track</v-btn>
          </div>
        </div>

        <v-alert width="300px" v-if="error" type="error">
          Enter a valid tracking number !
        </v-alert>

          <div v-if="tracked && tracked.status != 'notfound'" style="width: 100%;">
            <h1>Your shipment:</h1>
            <Steps class="steps" :tracked="tracked" />
          </div>

          <div v-else-if="tracked && tracked.status == 'notfound'">
            <v-alert width="300px" type="error">
              Your shipment cannot be found.
            </v-alert>
          </div>
      </div>
    </section>

    <section>
      <div class="cover contact">
        <h1>Your experience is everything to us</h1>
      </div>
      <Contact id="contact" />
    </section>

  </div>
</template>

<script>
import axios from 'axios';
import Steps from '@/components/Steps'
import { eventBus } from '../main'
import Contact from '@/components/Contact'

export default {
  components: {
    Steps,
    Contact
  },
  data() {
    return {
      trackNum: null,
      appListItemsPrimary: [
        {
          img: require("@/assets/icon-glob.svg"),
          title: "Worldwide Carriers",
          paragraph:
            "Parcel King manages more than 600 carriers' data worldwide. What you get is real time tracking events for all your carriers.",
          alt: "worldwide",
        },
        {
          img: require("@/assets/loading.svg"),
          title: "Analytics",
          paragraph:
            "Analyse carriers performance using the tracking data we supply. Find out exceptions and know your top destinations and carriers.",
          alt: "analytics",
        },
        {
          img: require("@/assets/auto-detect.svg"),
          title: 'Intelligent Detection',
          paragraph:
            "Parcel King's smart carrier auto detect system enables you to track your shipments by using only a tracking number and no other info.",
          alt: "auto-detect",
        },
      ],
      appListItemsSecondary: [
        {
          img: require("@/assets/search.svg"),
          title: 'Realtime Data',
          paragraph:
            "We provide our customers with a real time and consistent data. With Parcel King you should never worry about your parcel again.",
          alt: "realtime",
        },
        {
          img: require("@/assets/profile.svg"),
          title: 'Auto Track',
          paragraph:
            "Sign up for free, and now you can auto-track all your shipments in one place. Use your user profile to bookmark and store all your shipments.",
          alt: "auto-track",
        },
        {
          img: require("@/assets/top-rated.svg"),
          title: 'Top Rated',
          paragraph:
            "Parcel King is using top technology to build, making it a 'go-to' website for tracking and organizing all your relevant tracking numbers.",
          alt: "top-rated",
        },
      ],
      windowUnder: false,
      tracked: null,
      error: '',
      carriersNames: [],
      carriersCodes: [],
      selectedCarrier: '',
      loadingMain: false,
      loadingSelect: false
    };
  },
  methods: {
    getCarrier() {
      return new Promise((resolve, reject) => {
      if(!this.trackNum) {
        resolve();
        return;
      }
      this.loadingMain = true;
      axios.post('/carriers/detect', {
        "tracking_number": this.trackNum.trim()
      })
        .then(response => {
          let carriers = response.data.data;
          console.log(carriers);
          resolve(carriers);
        })
        .catch(err => {
          return err;
        });
      })
    },
    async postShipment() {
          const carriers = await this.getCarrier();
          console.log("U trackPackage()", carriers);
          return new Promise((resolve, reject) => {
            if(carriers && carriers.length > 1) {
              carriers.forEach(carrier => {
                this.carriersNames.push(carrier.name);
                this.carriersCodes.push(carrier.code);
              });
              this.loading = false;
              resolve();
              return;
            } else if((!carriers) || (carriers && carriers.length == 0)) {
              this.error = 'Enter a valid tracking number !';
              resolve();
              return;
            }
            axios.post('/trackings/post', {
              "tracking_number": this.trackNum.trim(),
              "carrier_code": carriers[0].code
            })
              .then(response => {
                console.log("U post shipment", response);
                resolve(carriers[0]);
              })
              .catch(err => {
                console.log(err);
                reject();
              });
          });
    },
    async trackPackage() {
      if(this.tracked) {
        this.tracked = null;
      }

      if(this.error) {
        this.error = '';
      }

      const carrier = await this.postShipment();
      if(!carrier) {
        this.loadingMain = false;
        return;
      }

      let tracking = await this.getTracking(carrier.code);
/*       let retry = 0;
      while(tracking.data.data.status == 'pending') {
        console.log("sending...")
        tracking = await this.getTracking(carrier.code);

        retry++;
        if(retry >= 10 && !tracking.data.data.origin_info) {
          console.log("status", tracking.data.data.origin_info.trackinfo);
          this.error = 'Invalid tracking number or server too slow. Try again.';
          this.loadingMain = false;
          return;
        }
      }

      this.tracked = tracking.data.data;
      this.loadingMain = false;
      this.trackNum = ''; */

      if(tracking.data.data.status == 'pending') {
        console.log("setting timeout");
        setTimeout(() => {
          setTimeout(() => {
            this.getTracking(carrier.code)
              .then(response => {
                this.tracked = response.data.data;
                console.log(this.tracked);
                this.loadingMain = false;
                this.trackNum = '';
              })
              .catch(err => {
                console.log(err);
              });
          }, 1000);
        }, 6000);
        return;
      }
      
      this.tracked = tracking.data.data;
      console.log(this.tracked);
      this.loadingMain = false;
      this.trackNum = '';
    },
    postWithCarrier(carrierCode) {
      return new Promise((resolve, reject) => {
        axios.post('/trackings/post', {
        "tracking_number": this.trackNum.trim(),
        "carrier_code": carrierCode
        })
          .then(res => {
            resolve(res);
            console.log("resolved");
          })
          .catch(err => {
            reject();
          });
        });
    },
    getTracking(carrierCode) {
      return new Promise((resolve, reject) => {
        axios.get(`/trackings/${carrierCode}/${this.trackNum.trim()}`)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject();
          });
      });
    },
    async trackWithCarrier() {
      if(!this.selectedCarrier) {
        console.log("error selection");
        return;
      }

      this.loadingSelect = true;
      const carrierCode = this.carriersCodes[this.carriersNames.indexOf(this.selectedCarrier)];
      console.log(carrierCode);
      await this.postWithCarrier(carrierCode);
      console.log("After resolved");
      const tracking = await this.getTracking(carrierCode);
      if(tracking.data.data.status == 'pending') {
        console.log("setting timeout")
        setTimeout(() => {
          setTimeout(() => {
          this.getTracking(carrierCode)
          .then(res => {
            this.tracked = res.data.data;
            console.log(this.tracked.status);
            this.trackNum = '';
            this.carriersNames = [];
            this.carriersCodes = [];
            this.loadingSelect = false;
          });
          }, 1000);
        }, 6000);
        return;
      }

      console.log(tracking);

      setTimeout(() => {
        this.getTracking(carrierCode)
        .then(res => {
          this.tracked = res.data.data;
          console.log(this.tracked.status);
          this.trackNum = '';
          this.carriersNames = [];
          this.carriersCodes = [];
          this.loadingSelect = false;
        });
      }, 0);
    }
  },
  created() {
      eventBus.$on('windowSizeChanged', (windowWidth) => {
        if(windowWidth < 600) {
          this.windowUnder = true;
        } else if(windowWidth > 600) {
          this.windowUnder = false;
        }
      });
  },
};
</script>

<style scoped lang="css">
div.body {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", "Helvetica", sans-serif;
}

.background {
  background-image: url("../assets/background-main.jpg");
  height: calc(100vh - 80px);
  opacity: 0.9;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

h1.bkg-title {
  font-weight: 700;
  font-size: 80px;
  color: white;
  text-shadow: 4px 4px 1px #1affc6;
  margin: 0 25px 70px 25px;
}

.background p {
  font-size: 27px;
  font-weight: 400;
  color: white;
}

.app-list {
  min-height: 350px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-around;
}

.app-list-item {
  margin: 0 30px;
}

.app-list-item p {
  max-width: 350px;
  margin-top: 20px;
}

.app-list-item h2 {
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;;
}

.cover {
  background-image: url("../assets/cover1.jpg");
  min-height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover h1 {
  padding: 20px;
  font-size: 3em;
  color: white;
  font-weight: 700;
  font-family: "Josefin Sans", "Sharp Sans", "Arial";
  margin: 0 20px;
}

.cover-2nd {
  background-image: url('../assets/cover2.jpg');
}

.cover-2nd h1 {
  font-size: 2.8em;
}

#sbs-sec {
  padding: 35px;
}

.side-by-side {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 45px auto;
}

.side-by-side .sbs-item {
  width: 50%;
  margin: 0 20px;
}

.sbs-item h3 {
  color: #323c46;
  margin-bottom: 1.325rem;
  font: 700 1.75rem/2.125rem "Montserrat", sans-serif;
}

.sbs-item p {
  max-width: 300px;
  margin: 0 auto;
  font: 500 0.975rem/1.375rem "Open Sans", sans-serif;
}

#track {
  background-color: #f7f7f7;
}

.track-pkg {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.track-pkg h1 {
  font-size: 40px;
  font-weight: 600;
  font-family: "Open Sans300", sans-serif;
  line-height: 75px;
  color: #03363d;
  text-align: center;
  padding: 15px 20px;
}

.track-pkg h3 {
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 30px;
  text-align: center;
  color: #03363d;
}

.tracking-box {
  display: block;
  width: 100%;
  text-align: center;
}

.track-field {
  display: inline-block;
  width: 50%;
  margin: 5px 15px;
}

.btn-track {
  margin-top: -5px;
}

.select-carrier {
  width: 100%; 
  margin: 0 auto;
}

.select-itm {
  display: inline-block;
  width: 20%;
}

.select-btn {
  margin-top: -3px;
  margin-left: 20px;
}

.steps {
  margin-top: 30px;
  padding: 0px 10px;
}

.contact {
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('../assets/contact-us.jpg');
  min-height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  padding: 20px;
  text-align: center;
}

@media only screen and (max-width: 700px) {
  h1.bkg-title {
    font-size: 40px;
    text-shadow: 2px 2px 4px #1affc6;
  }

  .background p {
    font-size: 21px;
  }
}

@media only screen and (max-width: 400px) {
  h1.bkg-title {
    font-size: 37px;
  }

  .background p {
    font-size: 20px;
  }
}

@media only screen and (max-width: 700px) {
  .app-list {
    flex-flow: wrap;
  }

  .app-list img {
    margin-top: 30px;
  }

  .app-list p {
    margin-bottom: 30px;
  }
}

@media only screen and (min-width: 1400px) {
  #sbs-sec {
    width: 80%;
    margin: 0 auto;
  }
}

@media only screen and (max-width: 700px) {
  .side-by-side {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0;
    width: 100%;
  }

  @media only screen and (max-width: 420px) {
    .cover h1 {
      font-size: 29px;
    }
  }

  #sbs-sec {
    padding: 10px;
  }

  .side-by-side .sbs-item.img-1 {
    height: auto;
    width: 100%;
    margin-top: 40px;
  }

  .side-by-side .sbs-item.img-2 {
    height: auto;
    width: 100%;
    margin-top: 40px;
  }

  .sbs-item h3 {
    margin-top: 32px;
  }
}

@media only screen and (max-width: 370px) {
  .cover h1 {
    font-size: 27px;
  }
}

@media only screen and (max-width: 800px) {
  .track-pkg h1 {
    font-size: 35px;
    line-height: 50px;
  }
}

@media only screen and (max-width: 450px) {
  .track-pkg {
    padding: 30px 0;
  }

  .track-pkg h1 {
    font-size: 24px;
    line-height: 32px;
    margin-top: 15px;
  }

  .track-pkg h3 {
    font-size: 17px;
    padding: 0px 10px;
  }
}

@media only screen and (max-width: 600px) {
  .select-itm {
    display: block;
    margin: 0 auto;
    width: 50%;
  }

  .select-btn {
    margin: 0 auto;
  }
}

@media only screen and (max-width: 350px) {
  .track-field {
    width: 80%;
  }
}
</style>