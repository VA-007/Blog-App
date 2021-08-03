const mongoose = require('mongoose')
const marked = require('marked')      // Helps us convert markdown to HTML in our app
const slugify = require('slugify')    // Convert the :id urls to the name of the title of the 
const createDomPurify = require('dompurify')     // dompurify helps to prevent malicious HTML to be written from our app
const { JSDOM } = require('jsdom')
const domPurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Default expects a function hence we dont pass parentheses like Date.now().We could have also writter new Date()
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

// --> Performing some validation before saving the article
articleSchema.pre('validate', function (next) {   // Using normal function instead of 'arrow', as 'arrow' functions do not bind 'this'
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });   // 'strict' -> removes any extra characters which can hinder the url
  }

  if (this.markdown) {  // Converting the markdown to HTML and removing any malicious HTML code using 'dompurify'
    this.sanitizedHtml = domPurify.sanitize(marked(this.markdown));
  }

  next();  // Transferring the control back to the middleware
});


module.exports = mongoose.model('Article', articleSchema);