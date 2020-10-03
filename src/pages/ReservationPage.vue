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

              <v-btn color="primary" @click="e1 = 2" :disabled="okStep1">
                OK
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-div class="headline font-weight-bold"
                >Vyberte typ strihu</v-div
              >
              <v-divider class="mt-2"></v-divider>

              <CutTypeMenu @getCutType="setCutType" />
              <v-btn color="primary" @click="e1 = 1" class="ma-1 pa-5">
                Späť
              </v-btn>
              <v-btn
                color="primary"
                @click.prevent="
                  goStep3();
                  e1 = 3;
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
                  v-model="reservationTime"
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
                        @click="reservationTime = item"
                        >{{ item }}</v-btn
                      >
                    </v-div>
                  </v-col>
                </v-btn-toggle>
              </v-row>
              <v-row justify="center" class="ma-1 pa-5">
                <v-btn color="primary" @click="e1 = 2" class="ma-1 pa-5">
                  Späť
                </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 = 4"
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
                <v-btn color="primary" @click="e1 = 3">
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
import emailjs from "emailjs-com";
declare let require: any;

@Component({
  components: { CutTypeMenu, ReservationDialogDone, ReservationForm },
  props: {
    availableTimes: Array,
    e1: {
      type: Number,
      default: 1
    },
    reservationDate: String,
    reservationTime: String,
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
    barbers: {
      type: Array,
      default: [
        {
          id: 1,
          name: "Vilo",
          photo: require("@/assets/images/vilo.jpg"),
          borderStyle: "none"
        },
        {
          id: 2,
          name: "Kubo",
          photo: require("@/assets/images/emptyAvatar.png"),
          borderStyle: "none"
        }
      ]
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
  cutTime!: string;
  barber!: string;
  barbers!: Array<any>;
  reservationDate!: string;
  reservationTime!: string;
  todayDate!: string;
  reservationForm!: Record<string, any>;
  allowedDates!: Record<string, any>;
  availableTimes!: Array<string>;
  datesData!: Record<string, any>;
  reservation!: Record<string, any>;
  okStep1!: boolean;
  okStep2!: boolean;
  okStep3!: boolean;
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
      barber: this.barber,
      cutType: this.cutType,
      cutTag: this.cutTag
    };

    axios
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
          "&cutType=" +
          this.cutType +
          "&cutTag=" +
          this.cutTag
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(response => {
        this.deleteReservedTime();
        this.sendMail();
        this.dialogState = true;
      });
  }

  private deleteReservedTime(): void {
    axios.delete(
      process.env.VUE_APP_GEMERBARBIER_API +
        "/deleteTime?date=" +
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

  private setBarber(barberName: string, id: number): void {
    this.barbers.forEach(c => (c.borderStyle = "none"));
    this.barbers[id - 1].borderStyle = "solid";
    this.barber = barberName;
    this.okStep1 = false;
    this.$vuetify.goTo(document.body.scrollHeight);
    this.todayDate = new Date().toISOString().substr(0, 10);
    axios
      .get(
        process.env.VUE_APP_GEMERBARBIER_API +
          "/availableDates/?barber=" +
          this.barber
      )
      .then((response: any) => {
        this.allowedDates = (val: any) => response.data.indexOf(val) !== -1;
      });
  }

  private setCutType(cutType: string, cutTag: string, cutTime: string): void {
    this.cutType = cutType;
    this.cutTag = cutTag;
    this.cutTime = cutTime;
    this.okStep2 = false;
    this.$vuetify.goTo(document.body.scrollHeight);
  }

  @Watch("reservationDate")
  private getAvailableTimes(): void {
    if(this.reservationDate != ""){
      axios
        .get(
          process.env.VUE_APP_GEMERBARBIER_API +
            "/availableTimes/?date=" +
            this.reservationDate +
            "&barber=" +
            this.barber +
            "&cutTime=" +
            this.cutTime
        )
        .then(response => {
          this.availableTimes = response.data;
          this.reservationTime = this.availableTimes[0];
        });
    }
  }

  private setValidForm(valid: boolean): void {
    this.valid = valid;
  }

  private setReservationForm(form: object): void {
    this.reservationForm = form;
  }

  private goStep3() {
    this.availableTimes = [];
    this.reservationDate = "";
    this.okStep3 = true;
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
