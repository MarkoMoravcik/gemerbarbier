import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ReservationPage from "../pages/ReservationPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import BarberPage from "../pages/BarberPage.vue";
//import store from "./store";

Vue.use(VueRouter);

const routes = [
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
    path: "/admin",
    name: "admin",
    components: {
      default: AdminPage
    }
    // beforeEnter: (to: any, from: any, next: (arg0: boolean | undefined) => void) => {
    //   if (store.state.authenticated == false) {
    //     next(false);
    //   } else {
    //     next(true);
    //   }
    // }
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
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
