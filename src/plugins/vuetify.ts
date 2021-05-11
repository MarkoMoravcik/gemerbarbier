import Vue from "vue";
import Vuetify from "vuetify/lib";
import ClassicCutIcon from "../components/icons/ClassicCutIcon.vue";
import ExclusiveCutIcon from "../components/icons/ExclusiveCutIcon.vue";
import BeardCutIcon from "../components/icons/BeardCutIcon.vue";
import Lightbox from "@morioh/v-lightbox";
import "@morioh/v-lightbox/dist/lightbox.css";

Vue.use(Lightbox);
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
    values: {
      classicCut: {
        component: ClassicCutIcon
      },
      exclusiveCut: {
        component: ExclusiveCutIcon
      },
      beardCut: {
        component: BeardCutIcon
      }
    }
  }
});
