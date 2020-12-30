<template>
  <v-app>
    <v-app-bar app color="main1" height="80">
      <v-row class="justify-center align-center buttonsPanel">
        <v-btn text @click="$vuetify.goTo('#startPage')">Domov </v-btn>
        <v-btn text @click="$vuetify.goTo('#about-us')">O nás </v-btn>
        <v-btn text @click="$vuetify.goTo('#price')">Služby/Cenník </v-btn>
        <v-btn text @click="$vuetify.goTo('#about-us')">Galéria </v-btn>
        <v-btn text @click="$vuetify.goTo('#contact')">Kontakt </v-btn>
      </v-row>
    </v-app-bar>
    <v-content>
      <section id="startPage">
        <v-img
          :aspect-ratio="16 / 9"
          :src="homeImage"
          style="position: relative"
        >
          <v-container justify-center fluid fill-height class="align-end">
            <v-row class="justify-center buttonsPanel">
              <v-btn
                v-bind="buttonSize"
                v-if="$vuetify.breakpoint.xs"
                color="main1"
                @click="jumptToReservation()"
                ><b>Rezervácia</b>
              </v-btn>
              <v-btn
                v-bind="buttonSize"
                v-if="$vuetify.breakpoint.smAndUp"
                color="main1"
                @click="jumptToReservation()"
                class="mrb-60"
                ><b>Rezervácia</b>
              </v-btn>
            </v-row>
          </v-container>
        </v-img>
      </section>
      <section id="price">
        <v-img :src="priceListImage" style="position: relative">
          <div class="py-12"></div>
          <!--<v-container class="text-center">
          <h2 class="display-1 font-weight-bold mb-3" style="color:white">Služby/Cenník</h2>
        </v-container>-->
        </v-img>
      </section>

      <section id="about-us">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-1 font-weight-bold mb-3">O NÁS</h2>

          <v-responsive class="mx-auto mb-8" width="56">
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-responsive
            class="mx-auto title font-weight-light mb-8"
            max-width="720"
          >
            Gemerbarbier
          </v-responsive>

          <div></div>
        </v-container>

        <div class="py-12"></div>
      </section>
      <section id="contact">
        <div class="py-12"></div>

        <v-container class="text-center" fluid>
          <!-- <h2 class="display-1 font-weight-bold mb-3">Kontakt</h2>-->
          <GmapMap :center="center" :map-type-id="mapTypeId" :zoom="16">
            <GmapMarker
              v-for="(item, index) in markers"
              :key="index"
              :position="item.position"
              @click="center = item.position"
            />
          </GmapMap>
        </v-container>
      </section>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
declare let require: any;

@Component({
  components: {},
  props: {
    homeImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_homeBackground.jpg")
    },
    priceListImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_priceList.jpg")
    },
    center: {
      type: Object,
      default: { lat: 48.684073, lng: 20.1217573 }
    },
    mapTypeId: {
      type: String,
      default: "terrain"
    },
    markers: {
      type: Array,
      default: [{ position: { lat: 48.684073, lng: 20.1217573 } }]
    }
  }
})
export default class HomePage extends Vue {
  private jumptToReservation() {
    const routeData = this.$router.resolve({ name: "reservation" });
    window.open(routeData.href, "_blank");
  }

  private get buttonSize() {
    const size = { xs: "small", sm: "medium", lg: "large" }[
      this.$vuetify.breakpoint.name
    ];
    return size ? { [size]: true } : {};
  }

  get width() {
    alert(this.$vuetify.breakpoint.name);
    switch (this.$vuetify.breakpoint.name) {
      case "xs":
        return "200px";
      case "sm":
        return "400px";
      case "md":
        return "600px";
      case "lg":
        return "1920px";
      case "xl":
        return "1000px";
    }
    return null;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main1 {
  background: linear-gradient(
    45deg,
    rgba(30, 40, 59, 1) 0%,
    rgba(30, 40, 59, 1) 45%,
    rgba(96, 16, 19, 1) 100%
  );
}

.main1 > .v-btn {
  color: #e5ca9f;
}

.buttonsPanel > .v-btn:hover {
  color: white;
}

.buttonsPanel > .v-btn {
  color: #e5ca9f;
}

.buttonsPanel > .v-btn::before {
  outline: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.mrb-60 {
  margin-bottom: 50px;
}

.vue-map-container {
  height: 450px;
  max-width: none;
  width: 100%;
}
</style>
