import { createStore } from 'vuex'
import userClient from '@/clients/userClient.js'

export default createStore({
  state: {
    currentToken: "",
    currentUser:{},
  },
  mutations: {
    setCurrentToken(state, payload){
      state.currentToken = payload;
    },
    setCurrentUser(state, payload){
      state.currentUser = payload;
    }
  },
  actions: {
    async setCurrentToken(state, loginInfo){
      try {
        var data = await userClient.getToken(
          loginInfo.username,
          loginInfo.password,
        );
        state.commit("setCurrentToken", data.token)
        localStorage.setItem("token", data.token)
        var userData = await userClient.getUserInformation(data.token);
        state.commit("setCurrentUser", userData)
      } catch (err) {
        state.commit("setCurrentToken", "")
        state.commit("setCurrentUser", {})
        console.error(err);
      }
    }
  },
  modules: {
  },
  getters: {
    getCurrentToken: state => state.currentToken || localStorage.getItem("token"),
    getCurrentUser: state => state.currentUser
  }
})
