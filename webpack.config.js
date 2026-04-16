const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },

  mode: 'development', // change to 'production' for build

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  // devServer: {
  //   static: path.join(__dirname, 'dist'),
  //   port: 3000,
  //   open: true,
  //   hot: true,
  //   historyApiFallback: true, // for React Router
  // },
   devServer: {
    static: "./public",
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // for React Router
  },
};