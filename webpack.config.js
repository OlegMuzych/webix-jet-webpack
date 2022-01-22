const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
let pack = require("./package.json");

module.exports = (env)=>{

    let production = !!(env && env.production === "true");
    let asmodule = !!(env && env.module === "true");
    let standalone = !!(env && env.standalone === "true");

    let config = {
        mode: 'development',
        entry: {
            //main: path.resolve(__dirname, "./src/index.js"),
            main: path.resolve(__dirname, "./sources/myapp.js"),
        },
        output: {
            path: path.resolve(__dirname, "./dist"),
            filename: "[name].js",
            publicPath: "/dist/",
        },

        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new webpack.DefinePlugin({
                VERSION: `"${pack.version}"`,
                APPNAME: `"${pack.name}"`,
                PRODUCTION: production,
                BUILD_AS_MODULE: (asmodule || standalone)
            })
        ],

        module: {
            rules: [

                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                ["@babel/preset-env", {
                                    // "useBuiltIns": "entry"
                                }]
                            ]

                            //plugins: ['@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                },
                {
                    test: /\.(less|css)$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
                },
                {
                    test: /\.(svg|png|jpg|gif)$/,
                    use: "url-loader?limit=25000"
                },
            ]
        },
        resolve: {
            extensions: [".js"],
            modules: ["./sources", "node_modules"],
            alias: {
                "jet-views": path.resolve(__dirname, "sources/views"),
                "jet-locales": path.resolve(__dirname, "sources/locales")
            }
        },
        devServer: {
            // client: {
            //     logging: "error",
            // },
            // static: __dirname,
            // historyApiFallback: true,
            static: {
                directory: path.join(__dirname),
            },
            compress: true,
            port: 9000,
        },
    };
    return config;
}
