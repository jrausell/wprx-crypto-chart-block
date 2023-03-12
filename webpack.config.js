const path = require('path');
// This comes from https://github.com/WordPress/gutenberg/blob/trunk/packages/scripts/config/webpack.config.js
const wpConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//Modifing config
module.exports = {
   //Since whatever we put here will override the default configuration
   //We need to copy the values from the WP config
   ...wpConfig,

   //Point to the main file(s)
   entry: {
      "plugin-settings": path.resolve( process.cwd(), "src", "plugin-settings"),
      "plugin-block": path.resolve( process.cwd(), "src", "plugin-block"),
      "public": path.resolve( process.cwd(), "src", "public")
   },
   output: {
      filename: '[name].js',
      path: path.resolve( process.cwd(), 'build')
   },
   module: {
      ...wpConfig.config,
      rules: [
         ...wpConfig.module.rules,
         {
            //This sintax matches .ts and .tsx files
            test: /\.tsx?$/,
            use: [
               {
                  loader: 'ts-loader',
                  options: {
                     configFile: 'tsconfig.json',

                     // Speeds up by skipping type-checking. You can still use TSC for that.
                     transpileOnly: true,
                  }
               }
            ]
         },
         /*
         {
            test: /\.s[ac]ss$/,
            use: [
              // Creates `style` nodes from JS strings
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
         }
         */
      ]
   },
   //This merges with the WP settings
   //adds the ts files first
   /*
   resolve: {
      extensions: ['.ts', '.tsx', ...(wpConfig.resolve ? wpConfig.resolve.extensions || ['.js', '.jsx'] : [])]
   },

   plugins: [
     new MiniCssExtractPlugin({
       filename: '[name].css',
     }),
   ],
   */
}