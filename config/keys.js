// module.exports = {
//   mongoURI:'mongodb+srv://dev:lVTQuEFQw4Z4qYLu@cluster0.wegpj.mongodb.net/MERNdb?retryWrites=true&w=majority',
//   secretOrKey: 'secret'
// }


if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys_prod');
} else {
  module.exports = require('./keys_dev');
}
