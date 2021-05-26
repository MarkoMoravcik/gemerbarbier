<template>
  <v-app>
    <AdminMenu />
    <div>
      <v-data-table
        :headers="datesHeaders"
        :items="reservationDates"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        item-key="date"
        sort-by="date"
        mobile-breakpoint="300"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title> Tabuľka termínov</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" v-on="on">Pridaj termín</v-btn>
              </template>
              <v-date-picker
                locale="sk-SK"
                :first-day-of-week="1"
                v-model="reservationDate"
                type="date"
                scrollable
                :min="todayDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialog = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="save(reservationDate)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-icon color="red" small @click="deleteDate(item.date)">
            mdi-delete
          </v-icon>
        </template>
        <template class="lItems" v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-list-item
              v-for="time in item.availableTimes"
              :key="time.id"
              :id="time.id"
              v-bind:style="{ width: headers.length }"
            >
              <v-layout align-center justify-space-between fill-height>
                <h4 v-bind:style="{ color: time.color }">{{ time.state }}</h4>

                <h4>{{ time.time }}</h4>

                <v-icon
                  v-if="time.state == 'Active'"
                  color="red"
                  small
                  @click="deactiveTime(time.time, item.date)"
                >
                  mdi-close
                </v-icon>
                <v-icon
                  v-if="time.state == 'Inactive'"
                  color="green"
                  small
                  @click="activateTime(time.time, item.date)"
                >
                  mdi-calendar-plus
                </v-icon>
                <v-icon v-if="time.state == 'Reserved'"></v-icon>
              </v-layout>
            </v-list-item>
          </td>
        </template>
      </v-data-table>
    </div>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import axios from "axios";
import AdminMenu from "@/components/AdminMenu.vue";
require("dotenv").config();

@Component({
  components: { AdminMenu },
  props: {
    datesHeaders: {
      type: Array,
      default: () => [
        {
          text: "Dátum",
          value: "date"
        },
        { text: "Počet aktívnych časov", value: "times" },
        { text: "", value: "data-table-expand" },
        { text: "", value: "action" }
      ]
    },
    singleExpand: {
      type: Boolean,
      default: true
    },
    todayDate: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    },
    reservationDate: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    }
  }
})
export default class AdminSchedulePage extends Vue {
  dialog = false;
  reservationDates: Array<Record<string, any>> = [];
  todayDate!: string;
  expanded: Array<any> = [];

  private async deleteDate(date: any) {
    confirm("Naozaj chcete odstrániť tento termín?") &&
      (await axios.delete(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/deleteDate?date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber
      ));
    this.updateTable();
  }

  private async deactiveTime(time: string, date: string) {
    await axios
      .post(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/deactiveTime?time=" +
          time +
          "&date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber
      ) // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(response => {
        this.updateTable();
      });
  }

  private async activateTime(time: string, date: string) {
    await axios
      .post(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/activateTime?time=" +
          time +
          "&date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(response => {
        this.updateTable();
      });
  }

  private async save(date: any) {
    if (this.reservationDates.filter(e => e["date"] === date).length == 0) {
      await axios
        .post(
          process.env.VUE_APP_GEMERBARBIER_API +
            "/newFullDate?date=" +
            date +
            "&barber=" +
            this.$store.getters.actualBarber
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then(response => {
          this.updateTable();
          this.dialog = false;
        });
    } else {
      alert("Vybraný dátum už existuje medzi pridanými termínmi");
    }
  }

  @Watch("$store.getters.actualBarber")
  private barberMenuChange() {
    this.updateTable();
  }

  private async updateTable() {
    this.reservationDates = [];
    await axios
      .get(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/reservationDates?barber=" +
          this.$store.getters.actualBarber
      )
      .then(response => {
        response.data.forEach((dateObject: any) => {
          let count = 0;
          dateObject["availableTimes"].forEach(element => {
            if (element["state"] == "Active") {
              count++;
            }
          });
          dateObject["times"] = count;
          this.reservationDates.push(dateObject);
        });
      });
  }

  private mounted() {
    this.updateTable();
  }
}
</script>
<style scoped></style>
