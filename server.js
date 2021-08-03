const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/atricles')
const methodOverride = require('method-override')

// Setting up express sever 
const app = express(); 

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const port = process.env.PORT;

// Setting the view engine to ejs (ejs will render our DOM)
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })) // This has to be set before app.use articleRouter 
app.use(methodOverride('_method'))  // Using the method override library here to override and implement the DELETE method for article 
app.use('/articles', articleRouter);  // Using the article router we instantiated in the articles.js file


// Rendering all the articles (Home Route)
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: 'desc'
  });
  res.render('articles/index', { articles: articles });   // Rendering the articles by sending all the articles to the index route ejs
})

// Starting server and listening on port
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})