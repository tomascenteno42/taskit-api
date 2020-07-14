const path = require("path");

const NodeExternals = require("webpack-node-externals");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    entry: "./src/index.ts",
    target: "node",
    externals: [NodeExternals()],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".tsx", ".ts"],
        plugins: [new TsconfigPathsPlugin()]
    },
    module: {
		rules: [
			{
				test: /.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
    },
    plugins: []
};

const configFactory = (env, args) => {
    if (args.mode === "development" && args.watch) {
        config.plugins.push(new NodemonPlugin());
    }

    if (args.mode === "production") {
        console.log("productio!")
        config.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                }
            })],
        }
    }

    return config;
}

module.exports = configFactory;