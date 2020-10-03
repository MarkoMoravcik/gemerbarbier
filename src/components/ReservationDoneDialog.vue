<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Rezervácia v Gemerbarbier
        </v-card-title>
        <v-card-text>
          Vaša rezervácia bola úspešne vytvorená. Jej zhrnutie vám bolo zaslané
          na zadaný e-mail.
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
    dialog: {
      type: Boolean,
      default: false
    }
  }
})
export default class ReservationDoneDialog extends Vue {
  dialog!: boolean;

  private closeDialog(): void {
    this.dialog = false;
    this.$router.replace({ name: "home" });
  }
}
</script>
