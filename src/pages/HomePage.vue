<template>
  <v-app>
    <v-app-bar app color="#1E283B" height="80px">
      <v-row class="justify-center align-center buttonsPanel">
        <v-btn text @click="$vuetify.goTo('#startPage')">Domov</v-btn>
        <v-btn text @click="$vuetify.goTo('#price')">Služby/Cenník</v-btn>
        <v-btn text @click="$vuetify.goTo('#about-us')">O nás</v-btn>
        <v-btn text @click="$vuetify.goTo('#gallery')">Galéria</v-btn>
        <v-btn text @click="$vuetify.goTo('#contact')">Kontakt</v-btn>
      </v-row>
    </v-app-bar>
    <v-content>
      <section id="startPage" class="section-with-map">
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
        <v-img v-else :src="homeImage">
          <v-container justify-center fluid fill-height class="align-end">
            <v-row
                class="justify-center buttonsPanel mb-11"
                style="margin-bottom: 100px;"
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
      <section id="price" class="section">
        <v-container class="sectionContainer">
          <div class="service-wrapper">
            <div
                class="service-info"
                style="opacity: 1; transform: translateX(0px) translateY(0px) translateZ(0px); transition: opacity 600ms ease 0s, transform 900ms ease 0s;"
            >
              <img
                  :src="cutOneImage"
                  width="60"
                  alt="Number 1"
                  class="service-icon"
              />
              <h4 class="subheading">Úprava brady</h4>
              <h5>{{ beardPrice }} €</h5>
              <p>
                Pre každého zákazníka, či už s bradou alebo strniskom. Proces
                začína zarovnaním brady a fúzov, potom prichádza na rad teplý
                vlhký uterák a zarovnanie s britvou, ďalej nasleduje voda po
                holeni na uzatvorenie pórov a nakoniec púder pre ukľudnenie
                pokožky. Cena v danom rozmedzí závisí od typu procesu. Pri úprave
                brady použitím britvy a vlhčeného uteráku je cena vyššia ako len pri
                použití strojčeku.
              </p>
            </div>
            <div
                class="service-info"
                style="opacity: 1; transform: translateX(0px) translateY(0px) translateZ(0px); transition: opacity 600ms ease 0s, transform 900ms ease 0s;"
            >
              <img
                  :src="cutTwoImage"
                  width="60"
                  alt="Number 2"
                  class="service-icon"
              />
              <h4 class="subheading">Obyčajný strih</h4>
              <h5>{{ basicCutPrice }} €</h5>
              <p>
                Pre nenáročných zákazníkov ktorí si nepotrpia na čistú postupku
                alebo kontúry, skôr pre klasikov ktorí chcú len skrátiť vlasy a
                ďalej nič neriešiť.
              </p>
            </div>
            <div
                class="service-info"
                style="opacity: 1; transform: translateX(0px) translateY(0px) translateZ(0px); transition: opacity 600ms ease 0s, transform 900ms ease 0s;"
            >
              <img
                  :src="cutThreeImage"
                  width="60"
                  alt="Number 3"
                  class="service-icon"
              />
              <h4 class="subheading">Obyčajný strih &amp; Úprava brady</h4>
              <h5>{{ basicBeardPrice }} €</h5>
              <p>Rýchly strih doplnený o úpravu brady.</p>
            </div>
            <div
                class="service-info"
                style="opacity: 1; transform: translateX(0px) translateY(0px) translateZ(0px); transition: opacity 600ms ease 0s, transform 900ms ease 0s;"
            >
              <img
                  :src="cutFourImage"
                  width="60"
                  alt="Number 4"
                  class="service-icon"
              />
              <h4 class="subheading">Exclusive barber strih</h4>
              <h5>{{ exclusiveCutPrice }} €</h5>
              <p>
                Detailné strihanie, kde sa vždy snažíme zladiť účes s tvarom
                hlavy a vašim štýlom, detailná postupka. Samozrejmosťou je aj
                umytie vlasov v prípade, že nie sú vhodné na strihanie.
              </p>
            </div>
            <div
                class="service-info"
                style="opacity: 1; transform: translateX(0px) translateY(0px) translateZ(0px); transition: opacity 600ms ease 0s, transform 900ms ease 0s;"
            >
              <img
                  :src="cutFiveImage"
                  width="60"
                  alt="Number 4"
                  class="service-icon"
              />
              <h4 class="subheading">
                Exclusive barber strih &amp; Úprava brady
              </h4>
              <h5>{{ exclusiveBeardPrice }} €</h5>
              <p>Detailný strih doplnený o úpravu brady.</p>
            </div>
          </div>
        </v-container>
      </section>

      <section id="about-us" class="section">
        <!-- <v-container
          class="sectionContainer"
          fluid

        >
          <h2 class="display-1 font-weight-bold mb-3">O NÁS</h2>

        </v-container> -->
      </section>
      <section id="gallery" class="section">
        <v-container class="align-center sectionContainer" fluid>
          <Gallery/>
        </v-container>
      </section>
      <section id="contact" class="section-with-map">
        <v-div class="container-2">
          <!-- <v-column>
            <v-img
              :src="instagramIcon"
              class="icon"
              @click="goToInstagram"
            ></v-img>
          </v-column> -->

          <GmapMap :center="center" :map-type-id="mapTypeId" :zoom="16">
            <GmapMarker
                v-for="(item, index) in markers"
                :key="index"
                :position="item.position"
                @click="center = item.position"
            />
          </GmapMap>
        </v-div>
      </section>
      <Chatbot></Chatbot>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Gallery from "@/components/Gallery.vue";
import {CutPrices} from "@/constants/cutPrices";
import Chatbot from "@/components/Chatbot.vue";

declare let require: any;

@Component({
  components: {Chatbot, Gallery},
  props: {
    cutOneImage: {
      type: String,
      default: require("@/assets/images/cutNumbers/1.png")
    },
    cutTwoImage: {
      type: String,
      default: require("@/assets/images/cutNumbers/2.png")
    },
    cutThreeImage: {
      type: String,
      default: require("@/assets/images/cutNumbers/3.png")
    },
    cutFourImage: {
      type: String,
      default: require("@/assets/images/cutNumbers/4.png")
    },
    cutFiveImage: {
      type: String,
      default: require("@/assets/images/cutNumbers/5.png")
    },
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
    beardImage: {
      type: String,
      default: require("@/assets/images/barbershop.jpg")
    },
    cutImage: {
      type: String,
      default: require("@/assets/images/barbershop.jpg")
    },
    center: {
      type: Object,
      default: () => ({lat: 48.684073, lng: 20.1217573})
    },
    mapTypeId: {
      type: String,
      default: "terrain"
    },
    markers: {
      type: Array,
      default: () => [{position: {lat: 48.684073, lng: 20.1217573}}]
    },
    basicCutPrice: {
      type: String,
      default: CutPrices.BASIC_CUT
    },
    beardPrice: {
      type: String,
      default: CutPrices.BEARD
    },
    exclusiveCutPrice: {
      type: String,
      default: CutPrices.EXCLUSIVE_CUT
    },
    basicBeardPrice: {
      type: String,
      default: CutPrices.BASIC_BEARD
    },
    exclusiveBeardPrice: {
      type: String,
      default: CutPrices.EXCLUSIVE_BEARD
    }
  }
})
export default class HomePage extends Vue {
  jumptToReservation() {
    const routeData = this.$router.resolve({name: "reservation"});
    window.open(routeData.href, "_blank");
  }

  get buttonSize() {
    const size = {xs: "medium", sm: "medium", lg: "large", xl: "large"}[
        this.$vuetify.breakpoint.name
        ];
    return size ? {[size]: true} : {};
  }

  get sectionHeight() {
    return window.innerHeight - 80;
  }

  goToInstagram() {
    window.location.href = "http://instagram.com/gemerbarbier/";
  }
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
  align-items: center;
  padding-top: 10px;
  padding-right: 10%;
  padding-bottom: 100px;
  padding-left: 10%;
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

.service-info {
  width: 50%;
  display: flex;
  margin-bottom: 40px;
  padding-right: 16px;
  padding-left: 16px;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: #e5ca9f;
}

.service-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.service-icon {
  height: 60px;
  margin-bottom: 16px;
}

.section {
  display: flex;
  padding: 100px 10%;
  align-items: center;
  background: #1f273a;
}

.section-with-map {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f273a;
}

.container-2 {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
