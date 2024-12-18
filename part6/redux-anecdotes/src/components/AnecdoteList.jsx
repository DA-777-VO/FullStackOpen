import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'


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
  // const anecdotes = useSelector(state => [...state.anecdotes]).sort((a, b) => b.votes - a.votes)
  const anecdotes = useSelector(state => {

    if (state.filter === null) {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLocaleLowerCase().includes(state.filter.toLocaleLowerCase())
    )
  })

  const sortedAnectodes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return(
      sortedAnectodes.map(anecdote =>
          <Anecdote
              key={anecdote.id}
              anecdote={anecdote}
              handleClick={() => dispatch(vote(anecdote.id))}
          />
      )
  )

}

export default AnecdoteList