import {useEffect} from "react";
import AnecdoteForm  from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter";
import Notification from "./components/Notification.jsx";
import {useDispatch} from "react-redux";
import {setAnecdotes} from "./reducers/anecdoteReducer";
import anecdoteService from "./services/anecdotes";

const App = () => {

  const dispatch = useDispatch();
    useEffect(() => {
      anecdoteService.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)));
    }, []);



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