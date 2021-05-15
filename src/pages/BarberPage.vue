<template>
  <v-app>
    <v-img :src="backImage" max-height="1024" aspect-ratio="1">
      <v-container fluid fill-height justify-center>
        <v-row justify="center" align="center">
          <v-btn
            v-for="barber in this.$store.getters.barbers"
            :key="barber.name"
            class="black--text ma-9"
            dark
            height="200"
            width="200"
            color="#E5C9BE"
            @click="selectBarber(barber.name)"
            ><h1>
              <b>{{ barber.name }}</b>
            </h1></v-btn
          >
        </v-row>
      </v-container>
    </v-img>
    <v-overlay v-if="pingBackend" :value="overlay">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
  props: {
    backImage: {
      type: String,
      default: require("@/assets/images/vintageBarberWall.jpg")
    },
    pingBackend: {
      type: Boolean,
      default: false
    }
  }
})
export default class BarberPage extends Vue {
  private pingBackend!: boolean;

  private async selectBarber(barberName: string) {
    this.pingBackend = true;
    await axios
      .get(process.env.VUE_APP_GEMERBARBIER_API, { timeout: 30000 })
      .then(() => {
        this.pingBackend = false;
        this.$store.commit("setBarberMenu", barberName);
        this.$router.push({ name: "calendar" });
      });
  }
}
</script>
<style scoped></style>
