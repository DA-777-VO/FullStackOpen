import { useSelector, useDispatch } from 'react-redux'
import { makeVote } from '../reducers/anecdoteReducer'
import {showNotification} from "../reducers/notificationReducer";


const Anecdote = ({anecdote, handleClick}) => {
  return (
      <div>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={handleClick}>vote</button>
        </div>
      </div>
  )
}

const AnecdoteList = () => {

  const dispatch = useDispatch()

  const anecdotes = useSelector((state) => {

    if (state.filter === null) {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLocaleLowerCase().includes(state.filter.toLocaleLowerCase())
    )

  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    dispatch(makeVote(anecdote))
    dispatch(showNotification(`You voted ${anecdote.content}`, 5))
  }

  return(
      sortedAnecdotes.map(anecdote =>
          <Anecdote
              key={anecdote.id}
              anecdote={anecdote}
              handleClick={() => handleVote(anecdote)}
          />
      )
  )

}

export default AnecdoteList


// Разобраться  со всеми ошибками