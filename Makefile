build: components index.js
	@component build

components: component.json
	@component install

node_modules:
	@npm install

clean:
	rm -fr build components

test: node_modules
	@jshint --config .jshintrc index.js
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test.html

.PHONY: clean test
