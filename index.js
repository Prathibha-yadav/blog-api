// index.js

const express = require('express');
const bodyParser = require('body-parser');
const BlogPost = require('./blog');
const ejs = require('ejs');
const path = require('path');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('newblog');
  });
  

// GET /blog - get all blog posts
app.get('/blog', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.render('blog', { blogPosts }); // Render the 'blog' template with data
  } catch (error) {
    console.error('Error getting blog posts', error);
    res.status(500).send('Internal Server Error');
  }
});
// POST /blog - create a new blog post
app.post('/blog', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const newPost = await BlogPost.create({ title, content, author });
    res.redirect('/blog');
  } catch (error) {
    console.error('Error creating blog post', error);
    res.status(500).send('Internal Server Error');
  }
});


// GET /blog/:id - get a specific blog post
app.get('/blog/:id', async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await BlogPost.findByPk(postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error('Error getting blog post', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /blog/:id - delete a specific blog post
app.delete('/blog/:id', async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const deleted = await BlogPost.destroy({
      where: {
        id: postId,
      },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error('Error deleting blog post', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
