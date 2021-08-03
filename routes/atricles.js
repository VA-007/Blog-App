const express = require('express')
const Article = require('./../models/article')
const router = express.Router()   // Creating a express router to handle all the article routes form here only.

// ------------>> Implementing the article routes<< ------------
router.get('/new', (req, res) => {      // Creating a new article
  res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {      // Updating existing article
  const article = await Article.findById(req.params.id);
  res.render('articles/edit', { article: article });
});

router.get('/:slug', async (req, res) => {    // Get an article by title(slug implemented -> id) route
  const article = await Article.findOne({ slug: req.params.slug });

  if (article == null) res.redirect('/');
  res.render('articles/show', { article: article });
});

router.post('/', async (req, res) => {  // Cerating a new post and then posting it
  let article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown
  });

  try {
    article = await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (e) {
    res.render('articles/new', { article: article });
  }
});

router.put('/:id', async (req, res) => {    // PUT route for putting the article after editing it
  let article = await Article.findById(req.params.id);
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  try {
    await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (e) {
    res.render('articles/edit', { article: article })
  }
});

router.delete('/:id', async (req, res) => {     // Delete route for deleting the post
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Exporting the article router 
module.exports = router;