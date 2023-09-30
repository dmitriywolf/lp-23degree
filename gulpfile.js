"use strict";
let gulp = require("gulp");
let sass = require("gulp-sass"); //Компилятор SCSS --> CSS
sass.compiler = require("node-sass");
let autoPrefix = require("gulp-autoprefixer"); //Расстановка префиксов
let cleanCSS = require("gulp-clean-css"); //Минификация CSS
let concat = require("gulp-concat"); //Обединение файлов
let uglifyES = require("gulp-uglify-es").default; //Минификация JS (ES5+)
let rename = require("gulp-rename"); //Перетменовае файлов
let del = require("del"); //Очистка
let browserSync = require("browser-sync").create(); //Локальный сервер

/*==================================================================================*/

//Html
function layoutHTML() {
  return gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

//Copy files
function copyFile() {
  const file = ["./src/*.ico", "./src/*.php"];

  return gulp
    .src(file)
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

//Styles
function style() {
  return (
    gulp
      .src("./src/sass/style.scss")
      //Компиляция SCSS to CSS
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      //Растановка префиксов
      .pipe(
        autoPrefix({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      //Минификация
      .pipe(
        cleanCSS({
          level: 2,
        })
      )
      //Переименование
      .pipe(rename({ suffix: ".min" }))
      //Папка назначения
      .pipe(gulp.dest("./dist/css"))
      .pipe(browserSync.reload({ stream: true }))
  );
}

//JavaScript
function script() {
  return gulp
    .src("./src/js/main.js")
    .pipe(concat("index.js"))
    .pipe(uglifyES())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist/js/"))
    .pipe(browserSync.reload({ stream: true }));
}

function scriptCopy() {
  return gulp.src(["./src/js/glide.min.js"]).pipe(gulp.dest("./dist/js"));
}

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });
  gulp.watch("./src/*.html", layoutHTML);
  gulp.watch("./src/sass/**/*.scss", style);
  gulp.watch("./src/js/*.js", script);
}

//Копирование изображений и шрифтов из src
function copyImg() {
  return gulp.src("./src/img/**/*.*").pipe(gulp.dest("./dist/img/"));
}

function copyFonts() {
  return gulp.src("./src/fonts/**/*.*").pipe(gulp.dest("./dist/fonts/"));
}

//Очитка папки dist
function clean() {
  return del(["./dist/*"]);
}

//Таск для удаления файлов в папке dist и запуск сборки
gulp.task(
  "build",
  gulp.series(
    clean,
    gulp.parallel(
      layoutHTML,
      copyFile,
      style,
      script,
      scriptCopy,
      copyImg,
      copyFonts
    )
  )
);

//Таск запускает таск build и watch последовательно
gulp.task("default", gulp.series("build", watch));
