import { createStore } from 'vuex'
import UserClient from '../clients/userClient.js'
import PropertyClient from '../clients/propertyClient'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    currentToken: "",
    currentUser:{},
    userProperties:[],
    currentChat:[]
  },
  plugins:[
    createPersistedState({
      storage: window.sessionStorage,
    })
  ],
  mutations: {
    setCurrentToken(state, payload){
      state.currentToken = payload;
    },
    setCurrentUser(state, payload){
      state.currentUser = payload;
    },
    setCurrentUserProperties(state, payload) {
      state.userProperties = payload
    }
  },
  actions: {
    async setCurrentToken(state, loginInfo){
      try {
        var data = await UserClient.getToken(
          loginInfo.username,
          loginInfo.password,
        );
        state.commit("setCurrentToken", data.token)
        var userData = await UserClient.getUserInformation(data.token);
        state.commit("setCurrentUser", userData)
        var propertyData = await PropertyClient.getUserProperties(userData, data.token)
        state.commit("setCurrentUserProperties", propertyData)


      } catch (err) {
        state.commit("setCurrentToken", "")
        state.commit("setCurrentUser", {})
        state.commit("setCurrentUserProperties", {})
        console.error(err);
      }
    }
  },
  modules: {
  },
  getters: {
    getCurrentToken: state => state.currentToken,
    getCurrentUser: state => state.currentUser,
    getCurrentUserProperties: state => state.userProperties
  }
})
