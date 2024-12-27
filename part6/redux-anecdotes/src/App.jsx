import AnecdoteForm  from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter";
import Notification from "./components/Notification.jsx";

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification/>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App