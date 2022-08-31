import { defineStore } from "pinia";
import Cookies from "js-cookie";
import {
    requestLogin,
    requestRegister } from '../services/authService'
export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    currentUser: [],
    isAuthenticated: false,
   
  }),
  getters: {
    getMessageAuth: (state) => state.message,
    authenticate: (state) => state.isAuthenticated,
  },
  actions: {
    async loginUser(currentUser) {
        this.currentUser = currentUser;
        this.isAuthenticated = true;
        Cookies.set('token', currentUser.Token);
    },

    async registerUser(currentRegister) {
      // const res = await requestRegister(registerForm);

      this.currentUser = currentRegister;
      this.isAuthenticated = false;
     
    },
  },
})