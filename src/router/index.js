import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  // BASE_URL matches vue.config.js's publicPath at build time (e.g.
  // /purrfect-focus/ in production, / in dev) — without it the router's
  // route matching breaks whenever the app isn't served from the domain root.
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
