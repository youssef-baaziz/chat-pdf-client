<template>
  <div class="row h-100 mt-5" v-if="!authenticated">
    <div class="mx-auto my-auto col-md-11">
      <div class="card auth-card">
        <div class="position-relative image-side">
        </div>
        <div class="form-side col-md-6">
          <h2 class="text-center text-dark mt-5">S'AUTHENTIFIER</h2>
          <div class="card my-5">
            <form class="card-body bg-white p-lg-5" @submit.prevent="formSubmit">
              <div class="mb-3">
                <input type="text" v-model="form.username" class="form-control" id="username" placeholder="Identifiant"
                  required>
              </div>
              <div class="mb-3">
                <input type="password" v-model="form.password" class="form-control" id="password"
                  placeholder="Mot de passe" required>
              </div>
              <div class="text-center">
                <button type="submit"
                  class="btn btn-color btn-multiple-state btn-shadow px-5 mb-2 float-left">S'AUTHENTIFIER</button>
              </div>
            </form>
          </div>
          <div v-if="errors.length">
            <div role="alert" aria-live="polite" aria-atomic="true" class="alert rounded alert-danger mt-2">
              <ul class="mb-0">
                <li v-for="(error, index) in errors" v-bind:key="index">
                  <p class="mb-0" v-if="error == 'crendentials empty'">
                    Merci d'entrer le nom d'utilisateur et le mot de passe
                  </p>
                  <p class="mb-0" v-if="error == 'username empty'">
                    Merci d'entrer le nom d'utilisateur
                  </p>
                  <p class="mb-0" v-if="error == 'password empty'">
                    Merci d'entrer le mot de passe
                  </p>
                  <p class="mb-0" v-if="error == 'Invalid Credentials'">
                    Connexion échouée. Vérifiez vos identifiants
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      errors: [],
    };
  },
  methods: {
    async formSubmit() {
      this.errors = [];

      // Validate form inputs
      if (!this.form.username) this.errors.push('username empty');
      if (!this.form.password) this.errors.push('password empty');

      // Attempt login if there are no validation errors
      if (this.errors.length === 0) {
        try {
          // Dispatch Vuex actions for authentication and user data
          await this.$store.dispatch('auth/signIn', this.form);
          await this.$store.dispatch('auth/getUser');
          this.$store.dispatch('setFilesUpload', []);
          this.$router.replace({ name: 'app' });
        } catch (error) {
          this.errors.push('Invalid Credentials');
        }
      }
    },
    toInscr() {
      this.$router.push({ name: 'inscription' });
    }
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
    }),
  },
};
</script>

<style scoped>
.btn-color {
  background-color: #317087;
  color: #fff;
  border-radius: 20px;
}

.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}

.alert {
  margin-top: 10px;
}

input.form-control {
  border-radius: 6px;
  border: 1px solid #ccc;
}

input.form-control:focus {
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 86, 179, 0.5);
}

a {
  text-decoration: none;
}

.auth-card {
  display: flex;
  flex-direction: row;
}

.auth-card .image-side {
  width: 40%;
  background: url("@/assets/Bot.gif") no-repeat center top;
  background-size: cover;
  padding: 80px 50px;
}

.auth-card .form-side {
  width: 60%;
  padding: 110px 50px;
}
</style>
