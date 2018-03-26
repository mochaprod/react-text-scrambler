const path = require("path");

module.exports = {
    mode: "development",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-text-scrambler": "ReactTextScrambler"
    },
    entry: {
        "./examples/static/dist": "./examples/demo.js"
    },
    output: {
        path: path.resolve(__dirname),
        filename: "[name]/examples.js"
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
