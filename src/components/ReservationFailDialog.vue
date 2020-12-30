<template>
  <div class="text-center">
    <v-dialog :value="value" @input="$emit('input', $event)" width="500">
      <v-card>
        <v-card-title class="headline red lighten-2" primary-title>
          Rezervácia v Gemerbarbier
        </v-card-title>
        <v-card-text>
          Vybraný termín bol medzičasom obsadený. Prosím vyberte iný.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
  props: {
    value: Boolean
  }
})
export default class ReservationFailDialog extends Vue {
  private closeDialog(): void {
    this.$emit("input", false);
  }
}
</script>
