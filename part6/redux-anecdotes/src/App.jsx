import {useEffect} from "react";
import AnecdoteForm  from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter";
import Notification from "./components/Notification.jsx";
import {useDispatch} from "react-redux";
import { initializeAnecdotes} from "./reducers/anecdoteReducer";

const App = () => {

  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(initializeAnecdotes());
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