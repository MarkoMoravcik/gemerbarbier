<template>
  <v-app>
    <v-img :src="backImage" max-height="1024" aspect-ratio="1">
      <v-container fluid fill-height justify-center>
        <v-row justify="center" align="center">
          <v-btn
            v-for="barber in barbers"
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
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
  props: {
    barbers: {
      type: Array,
      default: [
        {
          name: "Vilo"
        },
        {
          name: "Kubo"
        }
      ]
    },
    backImage: {
      type: String,
      default: require("@/assets/images/vintageBarberWall.jpg")
    }
  }
})
export default class BarberPage extends Vue {
  private selectBarber(barberName: string) {
    this.$store.commit("setBarberMenu", barberName);
    this.$router.push({ name: "admin/calendar" });
  }
}
</script>
<style scoped></style>
