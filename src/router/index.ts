import { createRouter, createWebHashHistory } from "vue-router";

// 成语
const idiom = () => import('@/views/xinhua/idiom.vue')
// 词语
const xiehouyu = () => import('@/views/xinhua/xiehouyu.vue')


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
  {
    path: '/xiehouyu',
    component: xiehouyu,
    name: 'xiehouyu',
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
export default router