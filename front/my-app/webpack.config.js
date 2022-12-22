const path = require("path");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/typescript", "@babel/react"],
                        }
                    }
                ]
            }
        ]
    }
};