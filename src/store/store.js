import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '../firebase';
import router from '../router';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    userTrackings: [],
    loading: false,
    authError: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setAuthError(state, payload) {
      state.authError = payload;
    },
    clearAuthError(state) {
      state.authError = null
    },
    setTrackings(state, payload) {
      state.userTrackings = payload;
    }
  },
  actions: {
    async signUserUp({ commit }, payload) {
      commit('setLoading', true);
      commit('clearAuthError');
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          commit('setLoading', false);
          let registeredUser = firebase.auth().currentUser;
          registeredUser.updateProfile({
            displayName: payload.username
          })
            .then()
            .catch(err => console.log(err));
          commit('setUser', {
            id: data.user.uid,
            username: payload.username,
          });
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setAuthError', err.message);
          console.log(err);
        })
    },
    async signUserIn({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        commit('setLoading', true);
        commit('clearAuthError');
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(async (data) => {
            const trackingDocs = await firebase.firestore().collection('trackings').where('id', '==', data.user.uid).get();
            let userTrackings =  [];
            trackingDocs.forEach(doc => {
              userTrackings.push(doc.data().tracking);
            })
            commit('setTrackings', userTrackings);
            commit('setUser', {
              id: data.user.uid,
              username: data.user.displayName,
              profilePicture: data.user.photoURL
            });
            commit('setLoading', false);
            resolve(0);
          })
          .catch(err => {
            commit('setLoading', false);
            commit('setAuthError', err.message);
            console.log(err);
            resolve(-1);
          })
      })
    },
    clearAuthError: ({ commit }) => {
      commit('clearAuthError');
    },
    logout: async ({ commit }) => {
      await firebase.auth().signOut();
      commit('setUser', null);
      commit('setTrackings', null);
      router.push('/')
    },
    async updateUser({ commit }, data) {
      commit('setUser', {
        id: data.uid,
        username: data.displayName,
        profilePicture: data.photoURL
      })
      const trackingDocs = await firebase.firestore().collection('trackings').where('id', '==', data.uid).get();
      let userTrackings =  [];
      trackingDocs.forEach(doc => {
        userTrackings.push(doc.data().tracking);
      })
      commit('setTrackings', userTrackings);
    }
  },
  getters: {
    user: (state) => {
      return state.user;
    },
    authError: (state) => {
      return state.authError;
    },
    loading: (state) => {
      return state.loading;
    },
    userTrackings: (state) => {
      return state.userTrackings
    }
  }
});