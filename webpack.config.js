const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "production",
    devtool: "inline-source-map",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    entry: {
        "./dist": "./src/index.js",
        "./docs/static/dist": "./src/index.js"
    },
    output: {
        library: "ReactTextScrambler",
        libraryTarget: "umd",
        path: path.resolve(__dirname),
        filename: "[name]/build.js"
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react",
                        ["@babel/preset-stage-2", {
                            "decoratorsLegacy": true
                        }]
                    ]
                }
            }
        ]
    }
};
