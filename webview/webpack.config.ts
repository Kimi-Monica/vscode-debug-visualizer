import * as webpack from "webpack";
import path = require("path");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
import ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const r = (file: string) => path.resolve(__dirname, file);

const mode = process.argv.some(v => v === "--playground")
	? "playground"
	: "default";

module.exports = {
	entry: [mode === "default" ? r("src/index.tsx") : r("src/playground.tsx")],
	output: {
		path: r("dist"),
		filename: "[name].js",
		chunkFilename: "[name]-[hash].js",
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
	devtool: "source-map",
	module: {
		rules: [
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
			{
				test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2|md)$/i,
				loader: "file-loader",
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: { transpileOnly: true },
			},
		],
	},
	node: {
		fs: "empty",
	},
	plugins: (() => {
		const plugins: any[] = [
			new HtmlWebpackPlugin(),
			new ForkTsCheckerWebpackPlugin(),
			new CleanWebpackPlugin(),
		];
		if (mode === "default") {
			plugins.push(
				new MonacoWebpackPlugin({
					// Add more languages here once webworker issues are solved.
					languages: ["typescript"],
				})
			);
		}
		return plugins;
	})(),
} as webpack.Configuration;
