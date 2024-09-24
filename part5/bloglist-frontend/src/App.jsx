import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
        setBlogs( blogs )
    )
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
          'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
       setErrorMessage('Wrong login or password')
      console.log('Error with authorization. Wrong login or password')
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('user logging out')
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }



  const createBlog = async (BlogToAdd) => {
    try {
      const createdBlog = await blogService
          .create(BlogToAdd)
      setSuccessMessage(
          `Blog ${BlogToAdd.title} was successfully added! With author ${BlogToAdd.author}`
      )
      setBlogs(blogs.concat(createdBlog))
      console.log(`Created Blog: ${createdBlog.title}, author ${createdBlog.author}`)
      setErrorMessage(null)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch(exception) {
      setErrorMessage(
          `Cannot add blog ${BlogToAdd.title}, author ${BlogToAdd.author}`
      )
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  if (user === null) {
   return (
       <div>
         <h2>Log in to application</h2>
         <Notification errorMessage={errorMessage} successMessage={successMessage}/>
         <LoginForm
             handleLogin={handleLogin}
             username={username}
             setUsername={setUsername}
             setPassword={setPassword}
             password={password}
         />
       </div>
   )
  }

  return (
      <div>
        <h2>blogs</h2>

        <Notification errorMessage={errorMessage} successMessage={successMessage} />

        <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>

        <BlogForm createBlog={createBlog} />

        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}/>
        )}
      </div>
  )


}

export default App