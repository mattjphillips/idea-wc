const path = require('path');

module.exports = {
  entry: './src/client/index.ts',
  mode: "development",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { 
            configFile: "tsconfig.json" 
        }
      },
      {
        test: /\.css$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'css'
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};