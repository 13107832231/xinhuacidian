
interface State{
  count:number
}
export default {
  state: {
    count: 1
  },
  mutations: {
    increment (state:State) {
      // εζ΄ηΆζ
      state.count++
    }

  },
  actions: {
    increment (context:any) {
      context.commit('increment')
    }
  }
}