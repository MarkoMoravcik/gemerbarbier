<template>
  <v-data-table
    :headers="datesHeaders"
    :items="reservationDates"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    show-expand
    item-key="date"
    sort-by="date"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Tabuľka termínov</v-toolbar-title>
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
            <v-btn text color="primary" @click="close">Cancel</v-btn>
            <v-btn text color="primary" @click="save(calDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
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
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import axios from "axios";
@Component({
  components: {},
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
export default class AdminSchedule extends Vue {
  editedIndex = -1;
  dialog = false;
  reservationDates: Array<Record<string, any>> = [];
  todayDate: string = new Date().toISOString().substr(0, 10);
  expanded: Array<any> = [];
  serverAddress = "http://localhost:8003";

  private deleteDate(date: any) {
    confirm("Naozaj chcete odstrániť tento termín?") &&
      axios.delete(this.serverAddress + "/deleteDate?date=" + date);
    this.updateTable();
  }

  private deleteTime(time: string, date: string) {
    confirm("Naozaj chcete odsrániť tento čas?") &&
      axios.delete(
        this.serverAddress + "/deleteTime?time=" + time + "&date=" + date
      );
    this.updateTable();
  }

  private close(): void {
    this.dialog = false;
    this.updateTable();
  }

  private save(date: any): void {
    //const formatedDate = moment(date).format("DD-MM-YYYY");
    if (this.reservationDates.filter(e => e["date"] === date).length == 0) {
      axios.post(this.serverAddress + "/newFullDate?date=" + date);
      this.close();
    } else {
      alert("Vybraný dátum už existuje medzi pridanými termínmi");
    }
  }

  private async updateTable() {
    this.reservationDates = [];
    axios.get(this.serverAddress + "/reservationDates").then(response => {
      response.data.forEach((dateObject: any) => {
        (dateObject["times"] = dateObject["availableTimes"].length),
          this.reservationDates.push(dateObject);
      });
    });
  }

  private async mounted() {
    this.updateTable();
  }
}
</script>
