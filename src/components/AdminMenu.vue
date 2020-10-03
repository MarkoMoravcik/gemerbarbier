<template>
  <v-div>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list>
        <v-subheader
          >{{ this.$store.getters.actualBarber }} Admin Panel</v-subheader
        >
        <v-divider />

        <v-list-item-group v-model="itemMenu" color="primary">
          <v-list-item v-for="item in items" :key="item.icon">
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
    itemMenu: {
      type: Number,
      default: 1
    },
    items: {
      type: Array,
      default: [
        {
          text: "Termíny",
          icon: "mdi-clock"
        },
        {
          text: "Kalendár",
          icon: "mdi-calendar"
        }
      ]
    }
  }
})
export default class AdminMenu extends Vue {
  itemMenu!: number;
  barberMenu!: number;
  items!: Array<any>;

  @Watch("itemMenu")
  private goCalendar(): void {
    this.$emit("calendarVis", this.itemMenu == 1);
  }
}
</script>
