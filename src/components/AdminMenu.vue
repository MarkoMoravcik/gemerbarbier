<template>
  <v-div>
    <v-toolbar dark color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-list-item-avatar class="mr-3">
        <v-img :src="getBarberImage()"></v-img>
      </v-list-item-avatar>

      <v-toolbar-title
        >{{ this.$store.getters.actualBarber }} Admin Panel
      </v-toolbar-title>
      <v-divider vertical class="ml-5" />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          icon
          min-width="150"
          v-for="item in items"
          :key="item.text"
          :to="item.link"
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" temporary absolute width="150">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="getBarberImage()"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{
          this.$store.getters.actualBarber
        }}</v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item-group v-model="itemMenu" color="primary">
          <v-list-item :to="item.link" v-for="item in items" :key="item.icon">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
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
          icon: "mdi-clock",
          link: "/admin/schedule"
        },
        {
          text: "Kalendár",
          icon: "mdi-calendar",
          link: "/admin/calendar"
        }
      ]
    },
    drawer: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: true
    },
    barberMenu: Number
  }
})
export default class AdminMenu extends Vue {
  itemMenu!: number;

  private getBarberImage() {
    if (this.$store.getters.actualBarber == "Vilo") {
      return require("@/assets/images/vilo.jpg");
    } else {
      return require("@/assets/images/emptyAvatar.png");
    }
  }

  @Watch("itemMenu")
  private goCalendar(): void {
    this.$emit("calendarVis", this.itemMenu == 1);
  }
}
</script>
