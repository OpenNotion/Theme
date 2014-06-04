var gulp = require("gulp"),
	gutil = require("gulp-util"),
	changed = require("gulp-changed"),
	imagemin = require("gulp-imagemin"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	stripDebug = require("gulp-strip-debug"),
	sass = require("gulp-ruby-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	minifycss = require("gulp-minify-css"),
	rename = require("gulp-rename"),
	clean = require("gulp-clean"),
	handlebars = require('gulp-handlebars'),
	defineModule = require('gulp-define-module');

var paths = {
	bower: "./src/bower_components",
	dist: "./",
	js: {
		src: "./src/scripts",
		dest: "./js"
	},
	css: {
		src: "./src/styles",
		dest: "./css"
	},
	images: {
		src: "./src/img",
		dest: "./img"
	}
};

gulp.task("default", ["images", "scripts", "styles"]);

gulp.task("clean", function () {
	return gulp.src([
		paths.js.dest + "/*",
		paths.css.dest + "/*",
		paths.images.dest + "/*"],
		{ read: false })
		.pipe(clean());
});

gulp.task("watch", ["default"], function () {
	gulp.watch(paths.js.src + "/**/*.js", ["scripts"]);
	gulp.watch(paths.images.src + "/**/*", ["images"]);
	gulp.watch(paths.css.src + "/**/*.scss", ["styles"]);
});

gulp.task("images", function () {
	return gulp.src(paths.images.src + "/*")
		.pipe(changed(paths.images.dest))
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task("scripts", function () {
	gulp.src([paths.bower + "/jquery/dist/jquery.js"])
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(stripDebug())
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.dest));

	gulp.src(paths.bower + "/modernizr/modernizr.js")
		.pipe(stripDebug())
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.dest));

	gulp.src([paths.js.src + "/*.js"])
		.pipe(concat("app.js"))
		.pipe(gulp.dest(paths.js.dest))
		.pipe(stripDebug())
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.dest));
});

gulp.task("styles", function () {
	return gulp.src([paths.css.src + "/app.scss"])
		.pipe(sass({
			loadPath: [
				paths.bower
			]
		}))
		.pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
		.pipe(concat("main.css"))
		.pipe(gulp.dest(paths.css.dest))
		.pipe(rename({suffix: ".min"}))
		.pipe(minifycss())
		.pipe(gulp.dest(paths.css.dest));
});
