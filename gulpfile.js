var gulp = require('gulp');
var path = require('path');
var swPrecache = require('sw-precache');

var rootDir = './public';

gulp.task('generate-sw', function(callback) {
	swPrecache.write(path.join(rootDir, 'sw.js'), {
		staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,svg,jpg,map}'],
		stripPrefix: rootDir
	}, callback);
});