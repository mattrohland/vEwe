all: testjshint testjsdoc

testjshint:
	jshint js/vewe.js --verbose

testjsdoc:
	jsdoc js/vewe.js -d ./jsdoc -r README.md
