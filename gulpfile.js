var gulp = require('gulp');
var gulpNodemon = require('gulp-nodemon')

gulp.task('develop', function () {
    gulpNodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
        .on('restart', function () {
            console.log('restarted!')
        })
})