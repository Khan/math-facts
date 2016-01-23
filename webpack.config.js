module.exports = {
    entry: './index.js',
    devtool: 'eval',
    output: {
        filename: 'web/bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!react-native-code-push)/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.web.js', '.js', '.jsx'],
        alias: {
          "react-native": "react-native-web",
          "ReactNativeART": "react-art"
        }
    }
};
