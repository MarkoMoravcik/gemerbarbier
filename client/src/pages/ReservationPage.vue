<template>
  <v-app>
    <v-img :src="backImage">
      <v-container class="justify-center d-inline-flex">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1"
              >Typ strihu</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2"
              >Dátum a čas</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step step="3">Osobné údaje</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-div class="headline font-weight-bold"
                >Vyberte typ strihu</v-div
              >
              <v-divider class="mt-2"></v-divider>

              <CutTypeMenu @getCutType="setCutType" />
              <v-btn color="primary" @click="e1 = 2" :disabled="ok1">
                OK
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-div class="headline font-weight-bold"
                >Vyberte dátum a čas</v-div
              >
              <v-divider class="mt-2"></v-divider>
              <v-row justify="center" class="mt-4 ml-1 mr-1">
                <v-date-picker
                  v-model="reservationDate"
                  :min="todayDate"
                  :allowed-dates="allowedDates"
                  @change="ok2 = false"
                ></v-date-picker>

                <v-btn-toggle
                  v-model="toggle_exclusive"
                  mandatory
                  group
                  class="mt-4 ml-1"
                >
                  <v-col cols="12" class="time-container">
                    <v-div class="time-picker">
                      <v-btn
                        v-for="item in availableTimes"
                        :key="item.id"
                        :id="item.id"
                        rounded
                        text
                        tabindex="-1"
                        @click="reservationTime = item"
                        >{{ item }}</v-btn
                      >
                    </v-div>
                  </v-col>
                </v-btn-toggle>
              </v-row>
              <v-row justify="center" class="ma-1 pa-5">
                <v-btn color="primary" @click="e1 = 1" class="ma-1 pa-5">
                  Späť
                </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 = 3"
                  class="ma-1 pa-5"
                  :disabled="ok2"
                >
                  OK
                </v-btn>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-div class="headline font-weight-bold"
                >Vyplňte Vaše osobné údaje</v-div
              >
              <v-divider class="mt-2"></v-divider>
              <ReservationForm
                @validForm="setValidForm"
                @form="setReservationForm"
              />
              <v-col cols="10" md="4">
                <v-btn color="primary" @click="e1 = 2">
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
                <ReservationDialogDone :dialog="dialogState" />
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
import ReservationDialogDone from "@/components/ReservationDoneDialog.vue";
import ReservationForm from "@/components/ReservationForm.vue";
import axios from "axios";
import moment from "moment";
import emailjs from "emailjs-com";
declare let require: any;

@Component({
  components: { CutTypeMenu, ReservationDialogDone, ReservationForm },
  props: {
    availableTimes: {
      type: Array
    },
    e1: {
      type: Number,
      default: 1
    },
    reservationDate: {
      type: String
    },
    reservationTime: {
      type: String
    },
    calendarDates: {
      type: Array
    },
    datesData: {
      type: Object,
      default: {
        availableDatesList: {
          id: 1,
          values: []
        },
        availableDates: []
      }
    },
    backImage: {
      type: String,
      default: require("@/assets/images/barbershop.jpg")
    },
    ok1: {
      type: Boolean,
      default: true
    },
    ok2: {
      type: Boolean,
      default: true
    },
    dialogState: {
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
  reservationDate!: string;
  reservationTime!: string;
  todayDate!: string;
  reservationForm!: Record<string, any>;
  allowedDates!: Record<string, any>;
  availableTimes!: Array<string>;
  calendarDates!: Array<string>;
  datesData!: Record<string, any>;
  reservation!: Record<string, any>;
  ok1!: boolean;
  ok2!: boolean;
  dialogState!: boolean;
  valid!: boolean;

  private createReservation(): void {
    this.reservation = {
      date: this.reservationDate,
      time: this.reservationTime,
      name: this.reservationForm["customerName"],
      surname: this.reservationForm["customerSurname"],
      email: this.reservationForm["customerMail"],
      phoneNumber: this.reservationForm["customerPhoneNumber"],
      note: this.reservationForm["customerNote"],
      cutType: this.cutType,
      cutTag: this.cutTag
    };

    axios.post(
      "http://localhost:8003/reservation?date=" +
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
        "&cutType=" +
        this.cutType +
        "&cutTag=" +
        this.cutTag
    );

    axios.delete(
      "http://localhost:8003/deleteTime?date=" +
        this.reservationDate +
        "&time=" +
        this.reservationTime
    );
    this.sendMail();
    this.dialogState = true;
  }

  private sendMail(): void {
    emailjs
      .send(
        "gmail_gemerbarbier",
        "template_JXE6YFZ0",
        this.reservation,
        "user_gite308JQJNk6GFm3KHh2"
      )
      .then(
        response => {
          //console.log("SUCCESS!", response.status, response.text);
        },
        err => {
          // console.log("FAILED...", err);
        }
      );
  }

  @Watch("reservationDate")
  private getAvailableTimes(): void {
    axios
      .get("http://localhost:8003/availableTimes/?date=" + this.reservationDate)
      .then(response => {
        this.availableTimes = response.data;
        this.reservationTime = this.availableTimes[0];
      });
  }

  private setCutType(cutType: string, cutTag: string): void {
    this.cutType = cutType;
    this.cutTag = cutTag;
    this.ok1 = false;
  }

  private setValidForm(valid: boolean): void {
    this.valid = valid;
  }

  private setReservationForm(form: object): void {
    this.reservationForm = form;
  }

  async mounted() {
    this.todayDate = new Date().toISOString().substr(0, 10);
    axios.get("http://localhost:8003/availableDates").then((response: any) => {
      this.allowedDates = (val: any) => response.data.indexOf(val) !== -1;
      this.calendarDates = response.data;
    });
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
