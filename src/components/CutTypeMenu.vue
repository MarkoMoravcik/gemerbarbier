<template>
  <v-container class="justify-center d-flex flex-nowrap">
    <v-row justify="center">
      <v-col :key="cut.index" lg="5" md="5" v-for="cut in cuts">
        <v-btn
          tabindex="-1"
          :ripple="false"
          text
          class="mt-10 button_icons"
          @click="selectCut(cut.index)"
          align-center
        >
          <v-icon
            v-bind:style="{ width: iconSize, height: iconSize }"
            tabindex="-1"
            :color="cut.color"
            >{{ cut.icon }}
          </v-icon>
          <v-icon
            v-bind:style="{ width: iconSize, height: iconSize }"
            tabindex="-1"
            :color="cut.color"
            v-if="cutContainsBeard(cut.tag)"
            >{{ cut.icon2 }}
          </v-icon>
        </v-btn>
        <h4 v-bind:style="{ color: cut.color }" :class="`mt-${rs}`">
          {{ cut.name }}
        </h4>
        <p v-bind:style="{ color: cut.color }">
          Cena: {{ cut.price }} €<br />
          Trvanie: {{ cut.time }} min
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CutPrices } from "@/constants/cutPrices";

@Component({
  components: {},
  props: {
    cuts: {
      type: Array,
      default: [
        {
          index: 1,
          name: "Exclusive barber strih",
          tag: "EXCLUSIVE_CUT",
          price: CutPrices.EXCLUSIVE_CUT,
          time: "40",
          icon: "$vuetify.icons.exclusiveCut",
          color: "black"
        },
        {
          index: 2,
          name: "Obyčajný strih",
          tag: "BASIC_CUT",
          price: CutPrices.BASIC_CUT,
          time: "20",
          icon: "$vuetify.icons.classicCut",
          color: "black"
        },
        {
          index: 3,
          name: "Úprava brady",
          tag: "BEARD",
          price: CutPrices.BEARD,
          time: "20",
          icon: "$vuetify.icons.beardCut",
          color: "black"
        },
        {
          index: 4,
          name: "Obyčajný strih + úprava brady",
          tag: "BASIC_BEARD",
          price: CutPrices.BASIC_BEARD,
          time: "40",
          icon: "$vuetify.icons.classicCut",
          icon2: "$vuetify.icons.beardCut",
          color: "black"
        },

        {
          index: 5,
          name: "Exclusive barber strih + úprava brady",
          tag: "EXCLUSIVE_BEARD",
          price: CutPrices.EXCLUSIVE_BEARD,
          time: "60",
          icon: "$vuetify.icons.exclusiveCut",
          icon2: "$vuetify.icons.beardCut",
          color: "black"
        }
      ]
    },
    iconSize: {
      type: String,
      default: "100px"
    },
    rs: {
      type: String,
      default: "11"
    }
  }
})
export default class CutsRadioGroup extends Vue {
  cuts!: Array<Record<string, any>>;

  cutContainsBeard(cut: any) {
    return cut.includes("_BEARD");
  }

  selectCut(index: any) {
    this.cuts.map(a => (a["color"] = "black"));
    this.cuts[index - 1]["color"] = "#1976d2";
    const cutType = this.cuts[index - 1]["name"];
    const cutTag = this.cuts[index - 1]["tag"];
    this.$emit("getCutType", cutType, cutTag, this.cuts[index - 1]);
  }
}
</script>
<style>
.button_icons::before {
  bottom: auto !important;
}

:focus {
  outline: 0;
}
</style>
