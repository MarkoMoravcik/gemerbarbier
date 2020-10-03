<template>
  <v-app>
    <v-layout fill-height>
      <v-row no-gutters>
        <AdminMenu @calendarVis="setCalendarVisible" />
        <v-divider vertical />
        <AdminCalendar v-if="calendarVisible" />
        <AdminSchedule v-if="!calendarVisible" />
      </v-row>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AdminMenu from "@/components/AdminMenu.vue";
import AdminCalendar from "@/components/AdminCalendar.vue";
import AdminSchedule from "@/components/AdminSchedule.vue";

@Component({
  components: { AdminCalendar, AdminMenu, AdminSchedule },
  props: {}
})
export default class AdminPage extends Vue {
  calendarVisible = true;

  private setCalendarVisible(calendarVisible: any): void {
    this.calendarVisible = calendarVisible;
  }
}
</script>
<style scoped></style>
