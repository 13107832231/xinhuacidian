import { createStore } from 'vuex'
import base from './modules/base'

const files = import.meta.globEager('./modules/*.ts')

const modules:any = {}
Object.keys(files).forEach((key) => {
	if (key === './index.js') return
	let keyName:string = key.replace(/(\.\/|\.ts)/g, '').replace('modules/','')
	modules[keyName] = files[key].default
})
export const store = createStore({
  modules
})

export function useStore() {
  return store 
}