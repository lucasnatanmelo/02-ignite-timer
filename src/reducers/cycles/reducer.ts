import { produce } from 'immer'

import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // Using Immer:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
      // Usual:
      //return {
      //  ...state,
      //  cycles: [...state.cycles, action.payload.newCycle],
      //  activeCycleId: action.payload.newCycle.id,
      //}
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      // Using Immer:
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
      })
    }
      // Usual:
      //return {
      //  ...state,
      //  cycles: state.cycles.map((cycle) => {
      //    if (cycle.id === state.activeCycleId) {
      //      return { ...cycle, interruptedDate: new Date() }
      //    } else {
      //      return cycle
      //    }
      //  }),
      //  activeCycleId: null,
      // }

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      // Using Immer:
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }
    // Usual:
    //return {
    //    ...state,
    //    cycles: state.cycles.map((cycle) => {
    //      if (cycle.id === state.activeCycleId) {
    //        return { ...cycle, finishedDate: new Date() }
    //      } else {
    //        return cycle
    //      }
    //    }),
    //    activeCycleId: null,
    //  }
    default:
      return state
  }
}
