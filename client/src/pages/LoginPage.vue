<template>
  <v-app>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md8>
          <v-form>
            <v-card class="elevation-12">
              <v-toolbar dark color="blue">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-alert color="error" :value="error" icon="close">
                The username or the password are incorrect.
              </v-alert>
              <v-card-text>
                <v-text-field
                  v-model="username"
                  prepend-icon="mdi-account"
                  name="login"
                  label="Login"
                  type="text"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  prepend-icon="mdi-lock"
                  name="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-card-text>
              <v-divider light></v-divider>
              <v-card-actions class="justify-center">
                <v-btn
                  align-center
                  round
                  color="primary"
                  dark
                  @click.prevent="login(username, password)"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
  props: {
    username: String,
    password: String,
    error: Boolean
  }
})
export default class LoginPage extends Vue {
  username!: string;
  password!: string;
  error!: boolean;

  public get expUsername(): string {
    return "gemerbarbier@gmail.com";
  }

  public get expPassword(): string {
    return "heslo1234";
  }

  login(username: any, password: any) {
    if (username == this.expUsername && password == this.expPassword) {
      this.$store.commit("setAuthentication", true);
      this.$router.replace({ name: "admin page" });
    }
  }
}
</script>

<style scoped></style>
