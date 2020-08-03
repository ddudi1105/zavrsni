<template>
  <div>
    <section>
      <b-steps
        position="bottom"
        size="is-medium"
        v-model="activeStep"
        :rounded="true"
        :has-navigation="false"
        label-position="bottom"
        :mobile-mode="mobileMode"
      >
        <b-step-item
          :type="{'is-success': 0 <= activeStep ? 'true' : 'false'}"
          step="0"
          label="Ordered"
          icon="basket-outline"
          :clickable="false"
        >
          <h1 class="title has-text-centered">Your shipment is being processed in parcel center.</h1>
        </b-step-item>

        <b-step-item
          step="1"
          icon="package-variant"
          label="In Transit"
          :type="{'is-success': 1 < activeStep ? 'true' : 'false'}"
          :clickable="false"
        >
          <h1 class="title has-text-centered">Your shipment is in transit.</h1>
        </b-step-item>

        <b-step-item
          :type="{'is-success': 2 < activeStep ? 'true' : 'false'}"
          step="2"
          icon="email-sync-outline"
          label="Out for delivery"
          :clickable="false"
        >
          <h1
            class="title has-text-centered"
          >Your shipment is ready to be picked up at local sort facility.</h1>
        </b-step-item>

        <b-step-item
          :type="{'is-success': true}"
          step="3"
          icon="check-outline"
          label="Delivered"
          :clickable="false"
        >
          <h1 class="title has-text-centered">Your item has been delivered.</h1>
        </b-step-item>
      </b-steps>
    </section>

    <v-container class="my-5 track-dsc">
      <v-card flat class="pl-3 pb-1 pr-4 pt-3" v-for="(checkpoint, index) in trackInfo" :key="index">
        <v-row :class="`checkpoint ${checkpoint.checkpoint_status}`">
          <v-col cols="12" md="6" lg="4">
            <div class="caption grey--text">Description</div>
            <div class="checkpoint">{{ checkpoint.StatusDescription }}</div>
          </v-col>
          <v-col cols="7" md="6" lg="3">
            <div class="caption grey--text">Details</div>
            <div>{{ checkpoint.Details }}</div>
          </v-col>
          <v-col cols="5" md="6" lg="3">
            <div class="caption grey--text">Date</div>
            <div>{{ checkpoint.Date }}</div>
          </v-col>
          <v-col cols="4" md="6" lg="2">
            <v-chip
              small
              :class="`${checkpoint.checkpoint_status} chip white--text`"
            >{{ checkpoint.checkpoint_status }}</v-chip>
          </v-col>
        </v-row>
        <hr />
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    tracked: {
      required: true,
    },
  },
  data() {
    return {
      statuses: {
        pending: 0,
        transit: 1,
        pickup: 2,
        delivered: 3,
      },
      activeStep: 0,
      trackInfo: null,
      mobileMode: "compact",
    };
  },
  watch: {
    status() {
      this.activeStep = this.statuses[this.tracked.status];
    },
  },
  created() {
    this.activeStep = this.statuses[this.tracked.status];
    if(this.tracked.origin_info) {
      this.trackInfo = this.tracked.origin_info.trackinfo;
    }
  },
};
</script>

<style scoped>
.checkpoint.delivered {
  border-left: 4px solid #008000;
  font-size: 12px;
}

.checkpoint.transit {
  border-left: 4px solid orange;
  font-size: 12px;
}

.checkpoint.pickup {
  border-left: 4px solid blue;
  font-size: 12px;
}

.checkpoint.pending {
  border-left: 4px solid red;
  font-size: 12px;
}

.track-dsc {
  width: 90%;
  margin: 0 auto;
}

.chip {
  margin-top:4px;
}

.chip.delivered {
  background: green !important;
}

.chip.transit {
  background: orange !important;
}

.chip.pickup {
  background: blue !important;
}

.chip.pending {
  background: red !important;
}

hr {
    background-color: whitesmoke;
    border: none;
    display: block;
    height: 2.1px;
    margin: 0 0;
}

@media only screen and (max-width: 652px) {
  section.step-content {
    display: inline !important;
    flex: 0 !important;
  }

  div[data-v-469af010].b-steps {
    display: flex;
    align-items: center;
  }

  div[data-v-469af010].b-steps h1 {
    /* selektirat samo section u kojem su steps i trenutni korak */
    width: 150px;
  }
}
</style>
