import {createSlice} from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    vote(state, action){
      const id = action.payload.id
      return state.map(anecdote => anecdote.id === id ? action.payload : anecdote)
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions


export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const makeVote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.voteUpdate(anecdote.id, {...anecdote, votes: anecdote.votes + 1} )
    dispatch(vote(updatedAnecdote))
  }
}


export default anecdoteSlice.reducer