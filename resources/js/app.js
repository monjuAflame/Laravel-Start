/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


window.Vue = require('vue');

//Gate js

import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);

// moment js 
import moment from 'moment';
// vue progressbar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '3px'
})

// sweet alert
import Swal from 'sweetalert2'
window.Swal = Swal;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})

window.Toast = Toast;

// v-form (npm i axios vform) 
import { Form, HasError, AlertError } from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)



// vueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let routes = [

  { path: '/dashboard', component: require('./components/Dashboard.vue').default },
	{ path: '/developer', component: require('./components/Developer.vue').default },
	{ path: '/users', component: require('./components/Users.vue').default },
	{ path: '/profile', component: require('./components/Profile.vue').default }

]

const router = new VueRouter({
	mode: 'history',
	routes
})

// vue filter
Vue.filter('upText', function(text) {
	// return text.charAT(0).toUpperCase() + text.slice(1);
	return text.charAt(0).toUpperCase() + text.slice(1)
	// return text.toUpperCase();
})
Vue.filter('myDate', function(date) {
	return moment(date).format('MMMM Do YYYY')
})

// Fire for load data( like laravel echo ##)

let Fire = new Vue;
window.Fire = Fire;


// passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);





Vue.component('example-component', require('./components/ExampleComponent.vue').default);


const app = new Vue({
    el: '#app',
    router
});
