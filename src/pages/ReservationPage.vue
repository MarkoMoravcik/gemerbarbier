<template>
  <v-app>
    <v-img :src="backImage">
      <v-container class="justify-center d-inline-flex">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1"
              >Tvoj barbier</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2"
              >Typ strihu</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="3"
              >Dátum a čas</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step step="4">Osobné údaje</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-div class="headline font-weight-bold"
                >Vyberte kto vás bude strihať</v-div
              >
              <v-divider class="mt-2"></v-divider>
              <v-container fluid>
                <v-row justify="center">
                  <v-col v-for="b in barbers" :key="b.id">
                    <v-img
                      :src="b.photo"
                      v-bind:style="{
                        borderStyle: b.borderStyle,
                        borderColor: '#1976D2'
                      }"
                      v-on:click="setBarber(b.name, b.id)"
                    ></v-img>

                    <v-divider class="mt-2 mb-2"></v-divider>
                    <p class="font-weight-black">{{ b.name }}</p>
                  </v-col>
                </v-row>
              </v-container>

              <v-btn
                color="primary"
                @click.prevent="
                  e1 = 2;
                  goStep2();
                "
                :disabled="okStep1"
              >
                OK
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-div class="headline font-weight-bold"
                >Vyberte typ strihu</v-div
              >
              <v-divider class="mt-2"></v-divider>

              <CutTypeMenu @getCutType="setCutType" />
              <v-btn
                color="primary"
                @click.prevent="
                  e1 = 1;
                  scrollToHead();
                "
                class="ma-1 pa-5"
              >
                Späť
              </v-btn>
              <v-btn
                color="primary"
                @click.prevent="
                  e1 = 3;
                  goStep3();
                "
                :disabled="okStep2"
              >
                OK
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-div class="headline font-weight-bold"
                >Vyberte dátum a čas</v-div
              >
              <v-divider class="mt-2"></v-divider>
              <v-row justify="center" class="mt-4 ml-1 mr-1">
                <v-date-picker
                  v-model="reservationDate"
                  :min="todayDate"
                  :allowed-dates="allowedDates"
                  @change="okStep3 = false"
                ></v-date-picker>

                <v-btn-toggle
                  v-model="elementNumber"
                  mandatory
                  group
                  class="mt-4 ml-1 mr-1"
                >
                  <v-col cols="12" class="time-container">
                    <v-div class="time-picker">
                      <v-btn
                        v-for="item in availableTimes"
                        :key="item.id"
                        :id="item.id"
                        rounded
                        text
                        @click="
                          reservationTime = item;
                          elementNumber = item;
                        "
                        >{{ item }}</v-btn
                      >
                    </v-div>
                  </v-col>
                </v-btn-toggle>
              </v-row>
              <v-row justify="center" class="ma-1 pa-5">
                <v-btn
                  color="primary"
                  @click="
                    e1 = 2;
                    scrollToHead();
                  "
                  class="ma-1 pa-5"
                >
                  Späť
                </v-btn>
                <v-btn
                  color="primary"
                  @click="
                    e1 = 4;
                    scrollToHead();
                  "
                  class="ma-1 pa-5"
                  :disabled="okStep3"
                >
                  OK
                </v-btn>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="4">
              <v-div class="headline font-weight-bold"
                >Vyplňte Vaše osobné údaje</v-div
              >
              <v-divider class="mt-2"></v-divider>
              <ReservationForm
                @validForm="setValidForm"
                @form="setReservationForm"
              />
              <v-col cols="10" md="4">
                <v-btn
                  color="primary"
                  @click="
                    scrollToHead();
                    e1 = 3;
                  "
                >
                  Späť
                </v-btn>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="ma-2"
                  @click.prevent="createReservation"
                >
                  Rezervovať
                </v-btn>
                <ReservationDoneDialog v-model="dialog" />
                <ReservationFailDialog v-model="failDialog" />
              </v-col>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-img>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CutTypeMenu from "@/components/CutTypeMenu.vue";
import ReservationDoneDialog from "@/components/ReservationDoneDialog.vue";
import ReservationForm from "@/components/ReservationForm.vue";
import ReservationFailDialog from "@/components/ReservationFailDialog.vue";
import axios from "axios";
import emailjs from "emailjs-com";
declare let require: any;

@Component({
  components: {
    CutTypeMenu,
    ReservationDoneDialog,
    ReservationFailDialog,
    ReservationForm
  },
  props: {
    availableTimes: Array,
    e1: {
      type: Number,
      default: 1
    },
    reservationDate: String,
    reservationTime: String,
    backImage: {
      type: String,
      default: require("@/assets/images/barbershop.jpg")
    },
    okStep1: {
      type: Boolean,
      default: true
    },
    okStep2: {
      type: Boolean,
      default: true
    },
    okStep3: {
      type: Boolean,
      default: true
    },
    dialog: {
      type: Boolean,
      default: false
    },
    failDialog: {
      type: Boolean,
      default: false
    },
    valid: {
      type: Boolean,
      default: false
    }
  }
})
export default class Reservation extends Vue {
  cutType!: string;
  cutTag!: string;
  barber!: string;
  reservationDate!: string;
  reservationTime!: string;
  todayDate!: string;
  reservationForm!: Record<string, any>;
  allowedDates!: Record<string, any>;
  availableTimes!: Array<string>;
  reservation!: Record<string, any>;
  okStep1!: boolean;
  okStep2!: boolean;
  okStep3!: boolean;
  dialog!: boolean;
  failDialog!: boolean;
  valid!: boolean;
  elementNumber!: string;
  cuts!: Array<Record<string, any>>;

  private barbers = [
    {
      id: 1,
      name: this.$store.getters.barbers[0].name,
      photo: this.$store.getters.barbers[0].photo,
      borderStyle: "none"
    },
    {
      id: 2,
      name: this.$store.getters.barbers[1].name,
      photo: this.$store.getters.barbers[1].photo,
      borderStyle: "none"
    }
  ];

  private async createReservation() {
    this.reservation = {
      date: this.reservationDate,
      time: this.reservationTime,
      name: this.reservationForm["customerName"],
      surname: this.reservationForm["customerSurname"],
      email: this.reservationForm["customerMail"],
      phoneNumber: this.reservationForm["customerPhoneNumber"],
      note: this.reservationForm["customerNote"],
      barber: this.barber,
      cutType: this.cutType,
      cutTag: this.cutTag
    };

    await axios
      .post(
        process.env.VUE_APP_GEMERBARBIER_API +
          "reservation?date=" +
          this.reservationDate +
          "&time=" +
          this.reservationTime +
          "&name=" +
          this.reservationForm["customerName"] +
          "&surname=" +
          this.reservationForm["customerSurname"] +
          "&email=" +
          this.reservationForm["customerMail"] +
          "&phoneNumber=" +
          this.reservationForm["customerPhoneNumber"] +
          "&note=" +
          this.reservationForm["customerNote"] +
          "&barber=" +
          this.barber +
          "&cutTag=" +
          this.cutTag
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(response => {
        this.reserveTime();
        this.sendMail();
        this.dialog = true;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(err => {
        this.failDialog = true;
      });
  }

  private async reserveTime() {
    await axios.post(
      process.env.VUE_APP_GEMERBARBIER_API +
        "/reserveTime?date=" +
        this.reservationDate +
        "&time=" +
        this.reservationTime +
        "&barber=" +
        this.barber +
        "&cutTag=" +
        this.cutTag
    );
  }

  private sendMail(): void {
    emailjs.send(
      process.env.VUE_APP_EMAIL_ADDRESS,
      process.env.VUE_APP_EMAIL_TEMPLATE,
      this.reservation,
      process.env.VUE_APP_EMAIL_USER_CODE
    );
  }

  private setBarber(barberName: string, id: number) {
    this.barbers.forEach(c => (c.borderStyle = "none"));
    this.barbers[id - 1].borderStyle = "solid";
    this.barber = barberName;
    this.okStep1 = false;
    this.scrollDown();
    this.todayDate = new Date().toISOString().substr(0, 10);
  }

  private async setCutType(
    cutType: string,
    cutTag: string,
    cuts: Array<Record<string, any>>
  ) {
    this.cuts = cuts;
    this.cutType = cutType;
    this.cutTag = cutTag;
    this.okStep2 = false;
    this.scrollDown();
    await axios
      .get(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/availableDates/?barber=" +
          this.barber +
          "&cutTag=" +
          cutTag
      )
      .then((response: any) => {
        this.allowedDates = (val: any) => response.data.indexOf(val) !== -1;
      });
  }

  @Watch("reservationDate")
  private async getAvailableTimes() {
    if (this.reservationDate != "") {
      await axios
        .get(
          process.env.VUE_APP_GEMERBARBIER_API +
            "/availableTimes/?date=" +
            this.reservationDate +
            "&barber=" +
            this.barber +
            "&cutTag=" +
            this.cutTag
        )
        .then(response => {
          this.availableTimes = response.data;
          this.reservationTime = this.availableTimes[0];
        });
    }
    this.scrollDown();
  }

  private setValidForm(valid: boolean): void {
    this.valid = valid;
  }

  private setReservationForm(form: object): void {
    this.reservationForm = form;
  }

  private scrollToHead() {
    this.$vuetify.goTo(document.head);
  }

  private scrollDown() {
    if (this.$vuetify.breakpoint.xs) {
      this.$vuetify.goTo(document.body.scrollHeight);
    }
  }

  private goStep3() {
    this.availableTimes = [];
    this.reservationDate = "";
    this.elementNumber = "";
    this.okStep3 = true;
    this.scrollToHead();
  }

  private goStep2() {
    this.cuts["color"] = "black";
    this.okStep2 = true;
    this.scrollToHead();
  }
}
</script>
<style>
.child-content {
  padding: 50px;
  text-align: center;
  z-index: 2;
  position: relative;
}

.time-picker > .v-btn--active > .v-btn__content {
  color: white;
}

.time-picker > .v-btn--active.v-btn::before {
  color: #1976d2;
  opacity: 1;
}

.time-picker > .v-btn--active.v-btn:focus::before {
  opacity: 1;
}

.time-picker > .v-btn:hover {
  color: #1976d2;
  opacity: 0.7;
}

.time-container {
  max-width: 300px;
}
</style>
