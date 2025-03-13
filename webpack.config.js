const webpackConfig = {
  mode: 'production',
  entry: {
    index: './app/js/index.js',
    // contacts: './app/js/contacts.js'
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

export default webpackConfig;
