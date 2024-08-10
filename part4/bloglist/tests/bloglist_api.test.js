const { test,after, beforeEach,describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')


describe('when there is initially some notes saved | api test', () => {

  beforeEach(async() => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('notes are returned as JSON', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async() => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async() => {
    const response = await helper.blogsInDb()
    assert.ok(response[0].id, 'Blog object doesnt have id property')
  })

  describe('tests with adding blogs', () => {
    test('Addition of a new blog', async() => {
      const newBlog = {
        title: 'Nomernoi',
        author: 'Konnov',
        url: 'https://reactpatterns.com/',
        likes: 888
      }

      await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.blogsInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)

      const content = notesAtEnd.map(blog => blog.title)
      assert(content.includes('Nomernoi'))

    })

    // test('if likes property is missing, it defaults to 0', async () => {
    //   const newBlog = {
    //     title: 'Blog without likes',
    //     author: 'Camera Man',
    //     url: 'https://reactpatterns.com/'
    //   }
    //
    //   const response = await api
    //     .post('/api/blogs')
    //     .send(newBlog)
    //     .expect(201)
    //     .expect('Content-Type', /application\/json/)
    //
    //   assert.strictEqual(response.body.likes, 0, 'Likes should default to 0')
    // })

    test('if likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Camera Man',
        url: 'https://reactpatterns.com/'
      }

      await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDb()
      const addedBlog = blogs.find(blog => blog.title === 'Blog without likes')

      assert.strictEqual(addedBlog.likes, 0)
    })

    test('if the title or url are missing, respond with 400', async () => {
      const newBlog = {
        author: 'Camera Man',
        likes: 333
      }

      await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
    })

  })

  describe('delete test', () => {
    test('deletion of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)

      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    })

  })

  describe('update test', () => {
    test('updation of a blog', async () => {

      const blogAtStart = await helper.blogsInDb()
      const blogToUpdate = blogAtStart[0]
      const newLikes = 666

      await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send({ ...blogToUpdate, likes: newLikes })
          .expect(200)
          .expect('Content-Type', /application\/json/)

      const blogAtEnd = await helper.blogsInDb()
      const updatedBlogAtEnd = blogAtEnd[0]

      assert.strictEqual(updatedBlogAtEnd.likes, newLikes)

    })
  })

})

after(async() => {
  await mongoose.connection.close()
})