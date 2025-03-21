import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { useField } from "./hooks/index";

const padding = {
  paddingRight: 5
}

const Menu = () => {

  return (
        <div>
          <Link style={padding} to="/">anecdotes</Link>
          <Link style={padding} to="/create">create new</Link>
          <Link style={padding} to="/about">about</Link>
        </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}>
        <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
      </li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {
  return (
      <div>
        <h2>{anecdote.content}</h2>
        <div style={{paddingBottom: 10}}>has {anecdote.votes} votes</div>
        <div style={{paddingBottom: 10}}>for more info see <a href={anecdote.info} target="_blank" rel="noopener noreferrer">{anecdote.info}</a></div>
      </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Notification = ({message}) => {
  console.log(`Notification component received message: "${message}"`)

  const style = {
    // border: 'solid',
    // padding: 10,
    // borderWidth: 1,
    marginBottom: 10
  }


  if (!message) {
    console.log('No message, not rendering notification')
    return null
  }

  console.log('Rendering notification with message')
  return (
      <div style={style}>
        {message}
      </div>
  )
}


const CreateNew = (props) => {

  const navigate = useNavigate()

  const { reset: resetContent, ...contentInput} = useField('content')
  const { reset: resetAuthor, ...authorInput} = useField('author')
  const {reset: resetInfo, ...infoInput} = useField('info')

  console.log("Field objects in CreateNew:", {
    content: contentInput,
    author: authorInput,
    info: infoInput
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: contentInput.value,
      author: authorInput.value,
      info: infoInput.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    console.log('Adding new anecdote with ID:', anecdote.id, anecdote)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`A new anecdote ${anecdote.content} created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
      ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
      : null

  return (
      <div>
        <h1>Software anecdotes</h1>
        <Menu/>
        <Notification message={notification} />

        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>}/>
          <Route path="/create" element={<CreateNew addNew={addNew}/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote}/>}/>
        </Routes>
        <footer>
          <Footer/>
        </footer>
      </div>
  )
}

export default App
