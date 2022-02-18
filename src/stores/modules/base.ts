
interface State{
  count:number
}
export default {
  state: {
    count: 1
  },
  mutations: {
    increment (state:State) {
      // 变更状态
      state.count++
    }

  },
  actions: {
    increment (context:any) {
      context.commit('increment')
    }
  }
}