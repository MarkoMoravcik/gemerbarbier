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
    actualBarber: state => {
      return state.actualBarberMenu;
    }
  },
  actions: {},
  modules: {}
});
