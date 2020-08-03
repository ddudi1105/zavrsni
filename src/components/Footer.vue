<template>
  <v-container class="container">
    <v-footer min-height="300px" color="white" padless>
      <v-card flat light tile class="footer-card text-center">
        <v-card-text
          class="pt-0 mt-2"
        >Supported by</v-card-text>

        <div class="sellers">
          <img 
            v-for="(seller, index) in sellers" 
            :src="seller" 
            :key="seller" 
            width="60" height="60"
            :class="{'wish' : index == 3}">
        </div>

        <v-divider></v-divider>
        <v-card-text
          class="pt-0 mt-2"
        >Top carriers</v-card-text>

        <div class="carriers">
          <img 
            v-for="carrier in carriers"
            :src="carrier"
            :key="carrier"
            width="60"
            height="60"
          >
        </div>

        <v-card-text class="social">
          <p class="mt-3">Follow Us</p>
          <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
            <v-icon color="black" size="29px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text>
          {{ new Date().getFullYear() }} —
          <strong>ParcelKing &copy;</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    sellers: [
      "https://image.flaticon.com/icons/svg/732/732084.svg",
      "https://image.flaticon.com/icons/svg/731/731962.svg",
      "https://image.flaticon.com/icons/svg/888/888898.svg",
      "https://ad19f3f32c8ffcbb36a3-900e03d2c940cd7044aba7e8955d765a.ssl.cf2.rackcdn.com/logos/260/76590_sq.jpg",
      "https://cdn.freebiesupply.com/logos/large/2x/amazon-de-logo-black-and-white.png"
    ],
    carriers: [
      require("../assets/hrvatska-posta.svg"),
      require("../assets/dhl.svg"),
      require("../assets/fedex.svg"),
      require("../assets/gls.svg"),
      require("../assets/dpd.svg")
    ]
  }),
};
</script>

<style scoped>
.container {
  width: 100% !important;
}

.sellers, .carriers {
  display: flex;
  justify-content: space-around;
}

.footer-card {
  margin: 0 auto; 
  width: 80%;
}

@media only screen and (max-width: 410px) {
  .sellers, .carriers {
    flex-wrap: wrap;
  }

  img {
    min-width: 80px;
  }

  .carriers {
    min-height: 250px;
    align-items: space-between;
  }

  .social {
    padding: 0;
    margin-bottom: 20px;
  }
}
</style>