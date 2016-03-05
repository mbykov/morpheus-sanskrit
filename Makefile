#
# Executables.
#

BIN := node_modules/.bin
g = _
REPORTER = spec
TESTS = test/node/*.js
FREQ = test/freq/*.js
SAMASA = test/samasa/*.js

#
# Source wildcards.
#

JS = index.js $(wildcard lib/*/*.js)
JSON = $(wildcard lib/*/*.json)

#
# Default
#

# Install npm dependencies and ensure mtime is updated
node_modules: package.json
	@npm install
	@touch $@

#
# Phony targets/tasks.
#

# Cleanup previous build.
clean:
	rm -rf build #components

# Run the server
server: bin/server node_modules
	@node --harmony $<

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 500 \
		--grep $(g) \
		--timeout 3000 \
		$(TESTS) \
		2> /dev/null

freq:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 500 \
		--bail \
		--grep $(g) \
		--timeout 3000 \
		$(FREQ) \
#		2> /dev/null



.PHONY: all clean server test
