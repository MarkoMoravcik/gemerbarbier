import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  state: {
    barbers: [
      {
        name: "Vilo",
        photo: require("@/assets/images/vilo.jpg")
      },
      {
        name: "Kubo",
        photo: require("@/assets/images/emptyAvatar.png")
      }
    ],
    cuts: [
      {
        name: "",
        tag: "",
        price: "",
        time: "",
        icon: ""
      }
    ],
    cutTags: [
      "BEARD",
      "BASIC_CUT",
      "BASIC_BEARD",
      "EXCLUSIVE_CUT",
      "EXCLUSIVE_BEARD"
    ],
    authenticated: false,
    actualBarberMenu: null
  },
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    setBarberMenu(state, barber) {
      state.actualBarberMenu = barber;
    }
  },
  getters: {
    actualBarber(state) {
      return state.actualBarberMenu;
    },
    barbers(state) {
      return state.barbers;
    },
    cutTags(state) {
      return state.cutTags;
    },

    barberPhoto(state) {
      return (barber: string) => {
        let barberPhoto: any;
        state.barbers.forEach(element => {
          if (element.name == barber) {
            barberPhoto = element.photo;
          }
        });
        return barberPhoto;
      };
    }
  },
  actions: {},
  modules: {}
});
