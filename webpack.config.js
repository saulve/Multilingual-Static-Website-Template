"use strict";

// Modules
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === "test" || ENV === "test-watch";
var isProd = ENV === "build";

module.exports = (function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest
    ? void 0
    : {
        app: "./src/app/app.js"
      };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest
    ? {}
    : {
        // Absolute output directory
        path: __dirname + "/dist",

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: isProd ? "/" : "http://localhost:8080/",

        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? "[name].[hash].js" : "[name].bundle.js",

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? "[name].[hash].js" : "[name].bundle.js"
      };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */

  // Extract text fails in development on live reload
  // thus set different loaders depending on the env
  // Ref: https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/30
  let loaders;

  if (isTest) {
    config.devtool = "inline-source-map";
    loaders = "null-loader";
  } else if (isProd) {
    config.devtool = "source-map";
    loaders = ExtractTextPlugin.extract([
      "css-loader",
      "resolve-url-loader",
      "sass-loader?sourceMap"
    ]);
  } else {
    config.devtool = "eval-source-map";
    loaders = [
      "style-loader",
      "css-loader",
      "resolve-url-loader",
      "sass-loader?sourceMap"
    ];
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        // CSS LOADER
        // Reference: https://github.com/webpack/css-loader
        // Allow loading css through js
        //
        // Reference: https://github.com/postcss/postcss-loader
        // Postprocess your css with PostCSS plugins
        test: /\.scss$/,
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files in production builds
        //
        // Reference: https://github.com/webpack/style-loader
        // Use style-loader in development.

        loader: loaders
      },
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/img/[name].[ext]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              query: {
                progressive: true,
                optimizationLevel: 7,
                interlaced: false
              }
            }
          }
        ]
      },
      {
        // FONT LOADER
        // Reference: https://github.com/webpack/file-loader
        // You can add here any file extension you want to get copied to your output
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        // HTML LOADER
        // Reference: https://github.com/webpack/raw-loader
        // Allow loading html through js
        test: /\.html$/,
        loader: "raw-loader"
      }
    ]
  };

  // ISTANBUL LOADER
  // https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
  // Skips node_modules and files that end with .spec.js
  if (isTest) {
    config.module.rules.push({
      enforce: "pre",
      test: /\.js$/,
      exclude: [/node_modules/, /\.spec\.js$/],
      loader: "istanbul-instrumenter-loader",
      query: {
        esModules: true
      }
    });
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  // NOTE: This is now handled in the `postcss.config.js`
  //       webpack2 has some issues, making the config file necessary

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    new ExtractTextPlugin({
      filename: "css/[name]_[hash].css",
      allChunks: true
    })
  ];

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: "./src/public/index.html",
        inject: "body"
      })
    );
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin(),

      // Reference: https://github.com/NMFR/optimize-css-assets-webpack-plugin
      // Minify css
      new OptimizeCssAssetsPlugin()
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: "./dist",
    stats: "minimal"
  };

  return config;
})();
