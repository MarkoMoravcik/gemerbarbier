<template>
  <v-form ref="form" v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.customerName"
            :rules="nameRules"
            :counter="10"
            label="Meno"
            required
            autocomplete
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.customerSurname"
            :rules="surnameRules"
            :counter="10"
            label="Priezvisko"
            required
            autocomplete
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.customerMail"
            :rules="emailRules"
            label="E-mail"
            required
            autocomplete
            type="email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.customerPhoneNumber"
            :rules="phoneRules"
            label="Telefónne číslo"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            v-model="form.customerNote"
            outlined
            name="input-7-4"
            label="Poznámka"
            rows="4"
            row-height="30"
            no-resize
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
  components: {},
  props: {}
})
export default class ReservationForm extends Vue {
  private valid = false;
  private nameRules = [
    (v: string) => !!v || "Zadajte meno",
    (v: string) => v.length <= 10 || "Meno musí mať menej než 10 znakov"
  ];
  private surnameRules = [
    (v: string) => !!v || "Zadajte priezvisko",
    (v: string) => v.length <= 10 || "Priezvisko musí mať menej než 10 znakov"
  ];
  private emailRules = [
    (v: string) => !!v || "Zadajte E-mail",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail nie je platný"
  ];
  private phoneRules = [
    (v: string) => !!v || "Zadajte telefónne číslo",
    (v: string) => v.length < 14 || "Telefónne číslo nie je platné",
    (v: string) => v.length > 12 || "Telefónne číslo nie je platné",
    (v: string) => /^[+][0-9]*$/.test(v) || "Telefónne číslo nie je platné"
  ];
  private form = {
    customerPhoneNumber: "+421",
    customerName: "",
    customerSurname: "",
    customerMail: "",
    customerNote: ""
  };

  @Watch("valid")
  private validForm() {
    this.$emit("validForm", this.valid);
  }

  mounted() {
    this.$emit("form", this.form);
  }
}
</script>
