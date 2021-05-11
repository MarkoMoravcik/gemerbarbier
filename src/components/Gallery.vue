<template>
  <lightbox cells="4" class="lightbox elevation-15" :items="images"></lightbox>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
  props: {}
})
export default class Gallery extends Vue {
  get images() {
    const imgs: Array<string> = [];
    for (let i = 1; i <= 32; i++) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      imgs.push(require("@/assets/images/hairCuts/" + i + ".jpg"));
    }
    return imgs;
  }
}
</script>
<style>
.lightbox {
  height: 604.8px;
  width: 650px;
}
</style>
