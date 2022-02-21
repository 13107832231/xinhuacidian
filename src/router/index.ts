import { createRouter, createWebHashHistory } from "vue-router";

// 成语
const idiom = () => import('@/views/xinhua/idiom.vue')


const routes = [
  {
    path: '/',
    redirect: 'idiom',
  },
  {
    path: '/idiom',
    component: idiom,
    name: 'idiom',
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
export default router