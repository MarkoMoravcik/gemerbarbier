<template>
  <v-dialog :value="value" @input="$emit('input', $event)" max-width="500px">
    <v-date-picker
      locale="sk-SK"
      :first-day-of-week="1"
      v-model="reservationDate"
      :allowed-dates="availableDates"
      type="date"
      scrollable
      :min="todayDate"
    >
      <v-container>
        <v-select
          v-model="cutTag"
          :items="this.$store.getters.cutTags"
          label="Typ strihu"
          solo
        ></v-select>

        <v-select
          v-model="reservationTime"
          :items="availableTimes"
          label="Čas rezervácie"
          solo
        ></v-select>

        <v-text-field
          v-model="firstName"
          :rules="nameRules"
          :counter="20"
          label="Meno"
          required
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          :rules="nameRules"
          :counter="20"
          label="Priezvisko"
          required
        ></v-text-field>

        <v-btn text color="primary" @click.native="closeDialog">Cancel</v-btn>
        <v-btn
          text
          color="primary"
          :disabled="!valid"
          @click="createReservation()"
          >OK
        </v-btn>
      </v-container>
    </v-date-picker>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";

@Component({
  components: {},
  props: {
    valid: {
      type: Boolean,
      default: false
    },
    reservationDate: Date,
    firstName: String,
    lastName: String,
    availableTimes: Array,
    cutTag: String,
    reservationTime: String,
    value: Boolean
  }
})
export default class AdminReservationDialog extends Vue {
  private firstName!: string;
  private lastName!: string;
  private reservationDate!: string;
  valid!: boolean;
  availableTimes!: Array<string>;
  availableDates!: Record<string, any>;
  private cutTag!: string;
  private reservationTime!: string;

  private closeDialog() {
    this.$emit("input", false);
  }

  @Watch("reservationDate")
  @Watch("firstName")
  @Watch("lastName")
  @Watch("cutTag")
  @Watch("reservationTime")
  check(): void {
    this.valid =
      this.firstName?.length > 0 &&
      this.lastName?.length > 0 &&
      this.cutTag?.length > 0 &&
      this.reservationTime?.length > 0 &&
      this.reservationDate?.length > 0;
  }

  async createReservation() {
    await axios
      .post(
        process.env.VUE_APP_GEMERBARBIER_API +
          "admin/reservation?date=" +
          this.reservationDate +
          "&time=" +
          this.reservationTime +
          "&name=" +
          this.firstName +
          "&surname=" +
          this.lastName +
          "&barber=" +
          this.$store.getters.actualBarber +
          "&cutTag=" +
          this.cutTag
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(response => {
        this.reserveTime();
        this.clearFields();
        this.closeDialog();
        this.$emit("mapReservation");
      });
  }

  private clearFields() {
    this.firstName = "";
    this.lastName = "";
    this.availableTimes = [];
    this.reservationTime = "";
    this.cutTag = "";
    this.reservationDate = "";
    this.availableDates = {};
  }

  private async reserveTime() {
    await axios.post(
      process.env.VUE_APP_GEMERBARBIER_API +
        "/reserveTime?date=" +
        this.reservationDate +
        "&time=" +
        this.reservationTime +
        "&barber=" +
        this.$store.getters.actualBarber +
        "&cutTag=" +
        this.cutTag
    );
  }

  @Watch("reservationDate")
  @Watch("cutTag")
  async getAvailableTimes() {
    if (this.cutTag?.length > 0 && this.reservationDate?.length > 0) {
      await axios
        .get(
          process.env.VUE_APP_GEMERBARBIER_API +
            "/allTimes/?date=" +
            this.reservationDate +
            "&barber=" +
            this.$store.getters.actualBarber +
            "&cutTag=" +
            this.cutTag
        )
        .then(response => {
          this.availableTimes = response.data;
          //this.reservationTime = this.availableTimes[0];
        });
    }
  }

  mounted() {
    this.getAvailableDates();
  }

  private async getAvailableDates() {
    await axios
      .get(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/allDates/?barber=" +
          this.$store.getters.actualBarber +
          "&cutTag=" +
          ""
      )
      .then((response: any) => {
        this.availableDates = (val: any) => response.data.indexOf(val) !== -1;
      });
  }
}
</script>
