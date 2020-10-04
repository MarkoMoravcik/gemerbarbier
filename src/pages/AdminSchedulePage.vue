<template>
  <v-app>
    <AdminMenu />
    <v-div>
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
            <v-toolbar-title>
              Tabuľka termínov</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" v-on="on">Pridaj termín</v-btn>
              </template>
              <v-date-picker
                locale="en-in"
                v-model="calDate"
                type="date"
                scrollable
                :min="todayDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialog = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="save(calDate)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-toolbar>
        </template>

        
        <template v-slot:[`item.action`]="{ item }">
          <v-icon color="red" small @click="deleteDate(item.date)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:expanded-item="{ item }">
          <v-list-item
            v-for="time in item.availableTimes"
            :key="time.id"
            :id="time.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ time }}</v-list-item-title>
            </v-list-item-content>
            <v-icon color="red" small @click="deleteTime(time, item.date)">
              mdi-delete
            </v-icon>
          </v-list-item>
        </template>
      </v-data-table>
    </v-div>
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
      default: [
        {
          text: "Dátum",
          value: "date"
        },
        { text: "Počet časov", value: "times" },
        { text: "", value: "data-table-expand" },
        { text: "", value: "action" }
      ]
    },
    singleExpand: {
      type: Boolean,
      default: true
    },
    calDate: {
      type: Date
    }
  }
})
export default class AdminSchedulePage extends Vue {
  dialog = false;
  reservationDates: Array<Record<string, any>> = [];
  todayDate: string = new Date().toISOString().substr(0, 10);
  expanded: Array<any> = [];

  private deleteDate(date: any) {
    confirm("Naozaj chcete odstrániť tento termín?") &&
      axios.delete(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/deleteDate?date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber
      );
    this.updateTable();
  }

  private deleteTime(time: string, date: string) {
    confirm("Naozaj chcete odsrániť tento čas?") &&
      axios.delete(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/deleteTime?time=" +
          time +
          "&date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber +
          "&cutTag=" +
          ""
      );
    this.updateTable();
  }
  private async save(date: any) {
    //const formatedDate = moment(date).format("DD-MM-YYYY");
    if (this.reservationDates.filter(e => e["date"] === date).length == 0) {
      await axios.post(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/newFullDate?date=" +
          date +
          "&barber=" +
          this.$store.getters.actualBarber
      );
      this.updateTable();
      this.dialog = false;
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
          (dateObject["times"] = dateObject["availableTimes"].length),
            this.reservationDates.push(dateObject);
        });
      });
  }

  private mounted() {
    this.updateTable();
  }
}
</script>
