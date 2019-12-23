const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    target: "node",
    mode: "development",
    entry: "./server/index.js",
    externals: [nodeExternals()],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        "@babel/preset-react",
                        ["@babel/preset-env"]
                    ],
                    plugins: [
                        "babel-plugin-syntax-async-functions",
                        "@babel/plugin-transform-async-to-generator",
                        "@babel/plugin-transform-runtime"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['isomorphic-style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            }
        ]
    }
}