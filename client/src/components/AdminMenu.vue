<template>
  <v-div>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list>
        <v-subheader>Admin Panel</v-subheader>
        <v-list-item-group v-model="menuItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {},
  props: {
    menuItem: {
      type: Number,
      default: 1
    },
    items: {
      type: Array,
      default: [
        { text: "Termíny", icon: "mdi-clock" },
        { text: "Kalendár", icon: "mdi-calendar" }
      ]
    }
  }
})
export default class AdminMenu extends Vue {
  menuItem!: number;

  @Watch("menuItem")
  private goCalendar(): void {
    if (this.menuItem == 1) {
      this.$emit("calendarVis", true);
    } else {
      this.$emit("calendarVis", false);
    }
  }

  // private goSchedule(): void {
  //   this.$emit("calendarVis", this.calendarVisible);
  // }
}
</script>
