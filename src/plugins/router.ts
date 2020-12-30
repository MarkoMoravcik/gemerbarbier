import Vue from "vue";
import VueRouter from "vue-router";
import { RouteConfig } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ReservationPage from "../pages/ReservationPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import BarberPage from "../pages/BarberPage.vue";
import AdminCalendarPage from "../pages/AdminCalendarPage.vue";
import AdminSchedulePage from "../pages/AdminSchedulePage.vue";
import store from "./store";

Vue.use(VueRouter);

// eslint-disable-next-line no-use-before-define
const routes = <Array<RouteConfig>>[
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
    path: "/reservation",
    name: "reservation",
    components: {
      default: ReservationPage
    }
  },
  {
    path: "/login",
    name: "login",
    components: {
      default: LoginPage
    }
  },
  {
    path: "/selectBarber",
    name: "selectBarber",
    components: {
      default: BarberPage
    },
    beforeEnter: (
      to: any,
      from: any,
      next: (arg0: boolean | undefined) => void
    ) => {
      if (store.state.authenticated == false) {
        next(false);
      } else {
        next(true);
      }
    }
  },
  {
    path: "/admin/calendar",
    name: "calendar",
    components: {
      default: AdminCalendarPage
    },
    beforeEnter: (
      to: any,
      from: any,
      next: (arg0: boolean | undefined) => void
    ) => {
      if (store.state.authenticated == false) {
        next(false);
      } else {
        next(true);
      }
    }
  },
  {
    path: "/admin/schedule",
    name: "schedule",
    components: {
      default: AdminSchedulePage
    },
    beforeEnter: (
      to: any,
      from: any,
      next: (arg0: boolean | undefined) => void
    ) => {
      if (store.state.authenticated == false) {
        next(false);
      } else {
        next(true);
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
