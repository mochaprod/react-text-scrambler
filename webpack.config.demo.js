const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-text-scrambler": "ReactTextScrambler"
    },
    entry: {
        "./docs/static/dist": "./docs/index.js"
    },
    output: {
        path: path.resolve(__dirname),
        filename: "[name]/docs.js"
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
