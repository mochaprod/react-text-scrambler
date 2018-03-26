const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "development",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    entry: {
        "./dist": "./src/index.js",
        "./examples/static/dist": "./src/index.js"
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
                    presets: ["env", "react", "stage-2"]
                }
            }
        ]
    }
};
