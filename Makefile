.PHONY: serve build

serve:
	npm install
	webpack-dev-server --progress --colors --port 9021

build:
	webpack -p --config webpack.production.config.js
