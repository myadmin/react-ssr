const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./client/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [ "@babel/preset-react", ["@babel/preset-env"]],
                    plugins: [
                        "babel-plugin-syntax-async-functions",
                        "@babel/plugin-transform-async-to-generator",
                        "@babel/plugin-transform-runtime"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.csr.html',
            template: 'src/index.csr.html',
            inject: true
        })
    ]
}