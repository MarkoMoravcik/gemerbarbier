<template>
  <v-app>
    <AdminMenu />
    <v-col>
      <v-layout justify-end align-end>
        <div v-if="$vuetify.breakpoint.xs" class="body-2">
          {{ title }}
        </div>
        <v-spacer />
        <v-btn v-bind="buttonSize" color="success" @click="dialog = true"
          >Pridaj rezerváciu</v-btn
        >
      </v-layout>
      <AdminReservationDialog
        v-model="dialog"
        @mapReservation="mapReservation"
      />

      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn
            v-bind="buttonSize"
            color="primary"
            class="mr-4"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn v-bind="buttonSize" icon small @click="prev">
            <v-icon v-bind="buttonSize" small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn v-bind="buttonSize" small icon @click="next">
            <v-icon v-bind="buttonSize" small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">{{
            title
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn v-bind="buttonSize" outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon v-bind="buttonSize" right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          locale="sk-SK"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        >
        </v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="220px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.cutType"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                v-bind="buttonSize"
                icon
                @click="deleteReservation(selectedEvent.id)"
              >
                <v-icon v-bind="buttonSize">mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span
                class="title"
                v-html="
                  selectedEvent.customerName + ' ' + selectedEvent.surname
                "
              ></span>
              <br />
              <v-divider></v-divider>
              <span v-html="selectedEvent.email"></span>
              <br />
              <a href="tel:'`${selectedEvent.phoneNumber}`">{{
                selectedEvent.phoneNumber
              }}</a>
              <br />
              <span v-html="selectedEvent.note"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AdminMenu from "@/components/AdminMenu.vue";
import AdminReservationDialog from "@/components/AdminReservationDialog.vue";
import axios from "axios";

@Component({
  components: { AdminMenu, AdminReservationDialog },
  props: {
    today: {
      type: String,
      default: new Date().toISOString().slice(0, 10)
    },
    focus: {
      type: String,
      default: new Date().toISOString().slice(0, 10)
    },
    type: {
      type: String,
      default: "month"
    },
    typeToLabel: {
      type: Object,
      default: () => ({
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      })
    },
    valid: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    },
    events: {
      type: Array,
      default: () => []
    }
  }
})
export default class AdminCalendarPage extends Vue {
  private today!: string;
  private focus!: string;
  private type!: string;
  private typeToLabel!: any;
  private start: any = null;
  private end: any = null;
  private selectedEvent: any = {};
  private selectedElement: any = null;
  private selectedOpen = false;
  private events!: Array<any>;

  private get calendarInstance(): Vue & {
    prev: () => void;
    next: () => void;
    getFormatter: (format: any) => any;
  } {
    return this.$refs.calendar as Vue & {
      prev: () => void;
      next: () => void;
      getFormatter: (format: any) => any;
    };
  }

  private get monthFormatter(): any {
    return this.calendarInstance.getFormatter({
      timeZone: "UTC",
      month: "long"
    });
  }
  private prev(): void {
    this.calendarInstance.prev();
  }

  private next(): void {
    this.calendarInstance.next();
  }

  private get title() {
    const { start, end } = this;
    if (!start || !end) {
      return "";
    }

    const startMonth: any = this.monthFormatter(start);
    const endMonth: any = this.monthFormatter(end);
    const suffixMonth: any = startMonth === endMonth ? "" : endMonth;

    const startYear: any = start.year;
    const endYear: any = end.year;
    const suffixYear: any = startYear === endYear ? "" : endYear;

    const startDay: string = start.day + this.nth(start.day);
    const endDay: string = end.day + this.nth(end.day);
    switch (this.type) {
      case "month":
        return `${startMonth} ${startYear}`;
      case "week":
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
      case "day":
        return `${startMonth} ${startDay} ${startYear}`;
      case "4day":
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
    }
    return "";
  }

  private nth(d: number) {
    return d > 3 && d < 21
      ? "th"
      : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
  }

  private setToday(): void {
    this.focus = this.today;
  }

  private viewDay({ date }: any) {
    this.focus = date;
    this.type = "day";
  }
  private getEventColor(event: any) {
    return event.color;
  }

  private showEvent({ nativeEvent, event }: any) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => (this.selectedOpen = true), 10);
    };
    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }
    nativeEvent.stopPropagation();
  }
  private updateRange({ start, end }: any) {
    this.start = start;
    this.end = end;
  }

  private get buttonSize() {
    const size = { xs: "small", sm: "medium" }[this.$vuetify.breakpoint.name];
    return size ? { [size]: true } : {};
  }

  mounted() {
    this.mapReservation();
  }

  private async mapReservation() {
    this.events = [];
    await axios
      .get(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/reservations?barber=" +
          this.$store.getters.actualBarber
      )
      .then(response => {
        response.data.forEach((dateObject: any) => {
          dateObject["customerName"] = dateObject["name"];
          dateObject["start"] = dateObject["startDateTime"];
          dateObject["end"] = dateObject["endDateTime"];
          dateObject["name"] = dateObject["cutType"];
          this.events.push(dateObject);
        });
      });
  }

  private async deleteReservation(id: number) {
    await axios.delete(
      process.env.VUE_APP_GEMERBARBIER_API +
        "/deleteReservation?id=" +
        id +
        "&barber=" +
        this.$store.getters.actualBarber
    );

    this.mapReservation();
    this.selectedOpen = false;
  }
}
</script>

<style scoped></style>
