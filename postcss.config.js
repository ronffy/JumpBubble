const autoprefixer = require('autoprefixer');
module.exports = {
  plugins: [
    autoprefixer({browsers: ['> 1%', 'ie > 8', 'last 2 versions']})
  ]
}