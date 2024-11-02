const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users',{
      data: {
        name: 'Zaur Dadiani',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Zaur Dadiani logged-in')).toBeVisible()
      await expect(page.getByRole('button',{name: 'create new blog'})).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai');
      await page.getByTestId('password').fill('81717');
      await page.getByRole('button', { name: 'login' }).click();


      const errorDiv = await page.locator('#error')
      await expect(errorDiv).toContainText('Wrong login or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Zaur Dadiani logged-in')).not.toBeVisible()

    })


    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {

        await createBlog (page, 'testingBlog', 'Zaur', 'http://dota2.com')

        const successDiv = await page.locator('#success')
        await expect(successDiv).toContainText('Blog testingBlog was successfully added! With author Zaur')
        await expect(successDiv).toHaveCSS('border-style', 'solid')
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

        await expect(page.getByText('testingBlog Zaur view')).toBeVisible();
      })


      test('a blog can be liked', async ({ page }) => {

        await createBlog (page, 'testingBlog', 'Zaur', 'http://dota2.com')

        await page.getByRole('button',{name: 'view'}).click()
        await page.getByRole('button',{name: 'like'}).click()

        await expect(page.getByText('Likes: 1')).toBeVisible();
      })


      test('a blog can be deleted', async ({ page }) => {

        await createBlog (page, 'testingBlog', 'Zaur', 'http://dota2.com')

        await page.getByRole('button',{name: 'view'}).click()
        await expect(page.getByRole('button',{name: 'remove'})).toBeVisible();

        page.on('dialog', async dialog => {
          console.log(dialog.message())
          await dialog.accept();
        });

        await expect(page.getByText('testingBlog Zaur view')).not.toBeVisible();

      })


      test('only owner can delete a blog', async ({ page, request }) => {

        await createBlog (page, 'testingBlog', 'Zaur', 'http://dota2.com')

        await page.getByRole('button', { name: 'logout' }).click();

        await request.post('http://localhost:5173/api/users',{
          data: {
            name: 'Linux',
            username: 'testUser',
            password: 'testuserpass'
          }
        })


        await page.getByTestId('username').fill('testUser');
        await page.getByTestId('password').fill('testuserpass');
        await page.getByRole('button', { name: 'login' }).click();

        await page.getByRole('button',{name: 'view'}).click()
        await expect(page.getByRole('button',{name: 'remove'})).not.toBeVisible();


      })

      test('the blogs are ordered by likes', async ({ page }) => {

        await createBlog (page, 'testingBlogFirstCreated', 'Zaur', 'http://dota2.com')
        await expect(page.getByText('testingBlogFirstCreated Zaur view')).toBeVisible();
        await createBlog (page, 'testingBlogTheMostLikes', 'Zaur', 'http://dota2.com')
        await expect(page.getByText('testingBlogTheMostLikes Zaur view')).toBeVisible();

        const theMostLikesBlogText = await page.getByText('testingBlogTheMostLikes Zaur view')
        const theMostLikesBlogElement = await theMostLikesBlogText.locator('..')

        await theMostLikesBlogElement.getByRole('button', { name: 'view'}).click({timeout: 3000})
        await theMostLikesBlogElement.getByRole('button', { name: 'like'}).click({timeout: 3000})
        await theMostLikesBlogElement.getByText('Likes: 1').waitFor()
        await expect(theMostLikesBlogElement.getByText('Likes: 1')).toBeVisible();
        await theMostLikesBlogElement.getByRole('button', { name: 'like'}).click({timeout: 3000})
        await expect(theMostLikesBlogElement.getByText('Likes: 2')).toBeVisible();
        await theMostLikesBlogElement.getByRole('button', { name: 'hide'}).click({timeout: 3000})



        const textboxes = await page.getByTestId('smallBlogID').all()
        await expect(textboxes[0]).toContainText('testingBlogTheMostLikes Zaur view')

      })

    })

  })

})