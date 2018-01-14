const autoprefixer = require('autoprefixer');
const modules = require('postcss-modules')
module.exports = {
  plugins: [
    autoprefixer({ 
      browsers: ['> 1%', 'ie > 8', 'last 2 versions'], 
    }),
    modules({
      scopeBehaviour: 'global', // can be 'global' or 'local'
    }),
  ]
}