const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const fileInclude = require('gulp-file-include');
const variables = require('./variables');

// Tarefa para limpar a pasta dist com importação dinâmica do 'del'
gulp.task('clean', async function() {
    const { deleteAsync } = await import('del'); // Importação dinâmica do módulo 'del'
    return deleteAsync(['dist']);
});

// Tarefa para concatenar e minificar JavaScript
gulp.task('scripts', function() {
    return browserify('src/js/main.js') // Arquivo de entrada
        .transform('babelify', { presets: ['@babel/preset-env'] }) // Transpilar para ES5 se necessário
        .bundle() // Faz o bundling (junta todos os imports)
        .pipe(source('scripts.js')) // Gera o arquivo Vinyl
        .pipe(buffer()) // Converte para buffer para que possamos minificar
        .pipe(uglify()) // Minifica o arquivo final
        .pipe(gulp.dest('dist/assets/js')) // Salva o arquivo minificado em dist
        .pipe(browserSync.stream());
});

// Tarefa para compilar, minificar SASS e substituir PNG/JPG por WEBP no CSS
gulp.task('styles', function() {
    return gulp.src('src/scss/styles.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        // Substituir extensões de imagens no CSS para .webp
        .pipe(replace(/\.(png|jpg|jpeg)/g, '.webp'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

// Tarefa para converter PNG, JPEG e JPG para WebP e renomear os arquivos
gulp.task('images:webp', async function() {
    const { default: imageminWebp } = await import('imagemin-webp');

    // Processar PNG, JPEG, JPG, convertendo-os para WebP e renomeando
    return gulp.src('assets/images/**/*.{png,jpeg,jpg}')
        .pipe(imagemin([
            imageminWebp({ quality: 80 }) // Converte PNG, JPEG, e JPG para WebP
        ]))
        .pipe(rename({ extname: '.webp' })) // Renomeia a extensão para .webp
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.stream());
});

// Tarefa para copiar arquivos SVG para a pasta dist sem processá-los
gulp.task('images:svg', function() {
    return gulp.src('assets/images/**/*.svg')
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.stream());
});

// Tarefa para copiar arquivos SVG para a pasta dist sem processá-los
gulp.task('images:ico', function() {
    return gulp.src('assets/images/**/*.ico')
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.stream());
});

// Tarefa para copiar arquivos WebP existentes para a pasta dist, sem processá-los
gulp.task('copy-webp', function() {
    return gulp.src('assets/images/**/*.webp')
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.stream());
});

// Tarefa para copiar arquivos de fontes para a pasta dist
gulp.task('fonts', function() {
    return gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(browserSync.stream());
});

// Tarefa para copiar arquivos HTML para a pasta dist
gulp.task('html', function() {
    let stream = gulp.src('./*.html')
        // Incluir arquivos parciais HTML (como _tags.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }));

    // Substituir as variáveis dinamicamente
    Object.keys(variables).forEach(function(key) {
        const regex = new RegExp('\\$' + key, 'g'); // Cria a expressão regular para cada chave
        stream = stream.pipe(replace(regex, variables[key]));
    });

    // Substituir extensões de imagens no HTML para .webp
    return stream
        .pipe(replace(/\.(png|jpg|jpeg)/g, '.webp'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Tarefa para atualizar os atributos data-large em HTML para WebP
gulp.task('update-data-large', function() {
    return gulp.src('./dist/*.html')
        .pipe(replace(/data-large="(.+?)\.(png|jpg|jpeg)"/g, 'data-large="$1.webp"'))
        .pipe(gulp.dest('./dist'));
});

// Servidor de desenvolvimento com live reload
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/scss/*.scss', gulp.series('styles'));
    gulp.watch('assets/images/*.{png,jpeg,jpg}', gulp.series('images:webp'));
    gulp.watch('assets/images/**/*.svg', gulp.series('images:svg'));
    gulp.watch('assets/images/**/*.webp', gulp.series('copy-webp'));
    gulp.watch('assets/fonts/**/*', gulp.series('fonts')); // Observa mudanças na pasta de fontes
    gulp.watch('./*.html', gulp.series('html', 'update-data-large'));
});

// Tarefa para build de produção
gulp.task('build', gulp.series('clean', 'scripts', 'styles', 'images:webp', 'images:svg', 'images:ico', 'copy-webp', 'fonts', 'html', 'update-data-large'));

// Tarefa padrão para desenvolvimento
gulp.task('default', gulp.series('build', 'serve'));
