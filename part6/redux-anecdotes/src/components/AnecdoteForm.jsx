import {useDispatch} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {showNotification} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log(content)
    dispatch(createAnecdote(content))
    dispatch(showNotification(`You added anecdote: ${content}`, 5))

    // просмотреть инструкцию, borders, initialState, commit
  }

  return (
      <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name="anecdote"/></div>
          <button type="submit">add</button>
        </form>
      </div>
  )
}

export default AnecdoteForm