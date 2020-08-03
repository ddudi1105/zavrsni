<template>
  <div id="contact">
    <div class="form-header">
      <p class="border"></p>
      <h1>Say Hi</h1>
    </div>
    <div class="form">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          outlined
          v-model="email" 
          :rules="emailRules" 
          label="E-mail" 
          required
        >
        </v-text-field>
        <v-select
          outlined
          v-model="select"
          :items="items"
          :rules="[v => !!v || 'Topic is required']"
          label="Topic"
          :selected="items[0]"
          required
        >
        </v-select>
        <v-textarea
          outlined
          v-model="message"  
          label="Your message"
          :rules="messageRules"
          :counter="counter"
          required
        >
        </v-textarea>
        <v-btn color="primary" class="white--text" rounded type="submit" @click="submit">Submit</v-btn>
      </v-form>
      <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <h2>Thanks, Your email was sent!</h2>
        </v-card-title>
      </v-card>
    </v-dialog>
    <h3>... or find us at</h3>
    </div>

    <div class="map">
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11574.275247163972!2d16.4689967!3d43.5113299!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x505534f00924e86!2sFakultet%20elektrotehnike%2C%20strojarstva%20i%20brodogradnje%20u%20Splitu!5e0!3m2!1shr!2shr!4v1596051156074!5m2!1shr!2shr" width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: ['Sales', 'Marketing', 'Cooperation', 'Careers' ], 
      message: null,
      counter: 250,
      messageRules: [
        v => !!v || 'Message is required',
        v => (v && v.length <= this.counter) || 'Message must be less than 250 characters',
      ]
    };
  },
  methods: {
    submit(event) {
      if(!this.$refs.form.validate()) {
        event.preventDefault();
      } else {
        event.preventDefault();
        this.$refs.form.reset();
        this.show = true;
      }
    }
  }
};
</script>

<style scoped>
#contact {
  margin: 0;
  padding: 0;
}

.form-header {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  margin-top: 45px;
  padding: 25px;
}

.border {
  margin: 0;
  width: 60px;
  margin: 0 auto;
  border-top: 4px solid brown;
}

.form-header h1 {
  font-size: 4rem;
  margin-bottom: 0.75em;
  font-family: "Sharp Sans", Arial, sans-serif;
  line-height: calc(1em + 8px);
  color: #03363d;
  font-weight: bold;
}

.form {
  width: 80%;
  margin: 0 auto;
  max-width: 550px;
  text-align: center;
  margin-bottom: 40px;
}

.form h3 {
  margin-top: 35px;
  font-size: 2rem;
  font-family: "Sharp Sans", Arial, sans-serif;
  color: #03363d;
}

iframe {
  margin-top: 20px;
  min-height: 350px;
}

@media only screen and (max-width: 420px) {
  .form-header h1 {
    font-size: 3rem;
  }
}

</style>