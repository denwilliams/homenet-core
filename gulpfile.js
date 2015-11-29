var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
 
console.log(tsconfig.compilerOptions);
 
gulp.task('default', function () {
    return gulp.src('src/main.ts')
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest('build'));
});