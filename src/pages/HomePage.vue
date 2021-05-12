<template>
  <v-app>
    <v-app-bar app color="#1E283B" height="80px">
      <v-row class="justify-center align-center buttonsPanel">
        <v-btn text @click="$vuetify.goTo('#startPage')">Domov </v-btn>
        <v-btn text @click="$vuetify.goTo('#price')">Služby/Cenník </v-btn>
        <v-btn text @click="$vuetify.goTo('#about-us')">O nás </v-btn>
        <v-btn text @click="$vuetify.goTo('#gallery')">Galéria </v-btn>
        <v-btn text @click="$vuetify.goTo('#contact')">Kontakt </v-btn>
      </v-row>
    </v-app-bar>
    <v-content>
      <section id="startPage">
        <v-img v-if="$vuetify.breakpoint.xs" :src="homeMobileImage">
          <v-container justify-center fluid fill-height class="align-end">
            <v-row
              class="justify-center buttonsPanel"
              style="margin-bottom: 80px;"
            >
              <v-btn
                v-bind="buttonSize"
                color="#1E283B"
                @click="jumptToReservation()"
                ><b>Rezervácia</b>
              </v-btn>
            </v-row>
          </v-container>
        </v-img>
        <v-img
          v-else
          :src="homeImage"
          v-bind:style="{ position: relative, height: sectionHeight + 'px' }"
        >
          <v-container justify-center fluid fill-height class="align-end">
            <v-row
              class="justify-center buttonsPanel mb-11"
              style="margin-bottom: 80px;"
            >
              <v-btn
                v-bind="buttonSize"
                color="#1E283B"
                @click="jumptToReservation()"
                ><b>Rezervácia</b>
              </v-btn>
            </v-row>
          </v-container>
        </v-img>
      </section>
      <section id="price">
        <v-img v-if="$vuetify.breakpoint.xs" :src="priceListMobileImage">
        </v-img>
        <v-img v-else :src="priceListImage"> </v-img>
      </section>

      <section id="about-us">
        <v-container
          class="sectionContainer"
          fluid
          v-bind:style="{ height: sectionHeight + 'px' }"
        >
          <h2 class="display-1 font-weight-bold mb-3">O NÁS</h2>

          <!-- <v-responsive
            class="mx-auto title font-weight-light mb-8"
            max-width="720"
          >
            Gemerbarbier
          </v-responsive> -->
        </v-container>
      </section>
      <section id="gallery">
        <v-container
          class="align-center sectionContainer"
          fluid
          v-bind:style="{ height: sectionHeight + 'px' }"
        >
          <Gallery />
        </v-container>
      </section>
      <section id="contact">
        <v-container
          class="align-content-space-between flex-wrap sectionContainer"
          v-bind:style="{ height: sectionHeight + 'px' }"
          fluid
        >
          <v-column>
            <v-img
              :src="instagramIcon"
              class="icon"
              @click="goToInstagram"
            ></v-img>
          </v-column>

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
import Gallery from "@/components/Gallery.vue";
declare let require: any;

@Component({
  components: { Gallery },
  props: {
    homeImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_homeBackground.jpg")
    },
    homeMobileImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_homeBackground_phone.jpg")
    },
    priceListImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_priceList.jpg")
    },
    priceListMobileImage: {
      type: String,
      default: require("@/assets/images/gemerbarbier_priceList_phone.jpg")
    },
    instagramIcon: {
      type: String,
      default: require("@/assets/images/instagramIcon.png")
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
    const size = { xs: "medium", sm: "medium", lg: "large", xl: "large" }[
      this.$vuetify.breakpoint.name
    ];
    return size ? { [size]: true } : {};
  }

  private get sectionHeight() {
    return window.innerHeight - 80;
  }

  private goToInstagram() {
    window.location.href = "http://instagram.com/gemerbarbier/";
  }

  // private get width() {
  //   alert(this.$vuetify.breakpoint.name);
  //   switch (this.$vuetify.breakpoint.name) {
  //     case "xs":
  //       return "200px";
  //     case "sm":
  //       return "400px";
  //     case "md":
  //       return "600px";
  //     case "lg":
  //       return "800px";
  //     case "xl":
  //       return "1000px";
  //   }
  //   return null;
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imageProp {
  height: 858px;
}

.sectionContainer {
  display: flex;
  justify-content: center;
  background-color: #1f273a;
}

.mainBackground > .v-btn {
  color: #e5ca9f;
}

.buttonsPanel > .v-btn:hover {
  color: white;
}

.buttonsPanel > .v-btn {
  color: #e5ca9f;
}

.icon {
  height: 50px;
  width: 50px;
}

.buttonsPanel > .v-btn::before {
  outline: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.vue-map-container {
  height: 450px;
  max-width: none;
  width: 100%;
}

.fancy-button-dark {
  height: 65px;
  margin-top: 24px;
  background-image: url(https://uploads-ssl.webflow.com/5d13857a4859bb32ead897a3/5d2f340d44c1f97b25821e30_Dark%20Button.svg);
  -webkit-transition: opacity 0.2s ease;
  transition: opacity 0.2s ease;
  color: #d9d8d6;
  line-height: 49px;
  letter-spacing: 1px;
}
</style>
