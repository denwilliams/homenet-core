var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var typedoc = require("gulp-typedoc");

console.log(tsconfig.compilerOptions);

gulp.task('default', function () {
    return gulp.src('src/main.ts')
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest('build'));
});

gulp.task("doc", function() {
    return gulp
        .src([
          "./lib/interfaces.d.ts",
          "./main.ts",
          "./lib/**/*.ts",
          "./typings/main.d.ts",
          "./typings/custom.d.ts",
          "./interfaces/**/*.ts"
        ])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es5",
            includeDeclarations: true,
            experimentalDecorators: true,

            // Output options (see typedoc docs)
            out: "./doc",
            mode: "file",

            // TypeDoc options (see typedoc docs)
            name: "Homenet",
            // theme: "minimal",
            ignoreCompilerErrors: false,
            externalPattern: "typings/**/*.d.ts",
            exclude: "typings/**/*.d.ts",
            excludeExternals: true,
            version: true
        }));
});
