module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        build: {
            files: {
                'output/annotator.min.js': ["src/lib/vendor/linkify.js","src/lib/vendor/linkify-string.js","src/lib/vendor/json2.js","src/lib/util.js","src/lib/console.js","src/lib/class.js","src/lib/range.js","src/lib/annotator.js","src/lib/widget.js","src/lib/editor.js","src/lib/viewer.js","src/lib/notification.js","src/lib/xpath.js","src/lib/plugin/store.js","src/lib/plugin/permissions.js","src/lib/plugin/annotateitpermissions.js","src/lib/plugin/auth.js","src/lib/plugin/tags.js","src/lib/plugin/unsupported.js","src/lib/plugin/filter.js"]
            }
        }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'output/annotator.min.css':["src/css/annotator.css"]
        }
      }
    },
    concat: {
    options: {
      separator: ';',
    },
    distJS: {
      src: ["src/lib/vendor/linkify.js","src/lib/vendor/linkify-string.js", "src/lib/vendor/json2.js","src/lib/util.js","src/lib/console.js","src/lib/class.js","src/lib/range.js","src/lib/annotator.js","src/lib/widget.js","src/lib/editor.js","src/lib/viewer.js","src/lib/notification.js","src/lib/xpath.js","src/lib/plugin/store.js","src/lib/plugin/permissions.js","src/lib/plugin/annotateitpermissions.js","src/lib/plugin/auth.js","src/lib/plugin/tags.js","src/lib/plugin/unsupported.js","src/lib/plugin/filter.js"],
      dest: 'output/annotator.js',
    },
    distCSS : {
      src: ["src/css/annotator.css"],
      dest: 'output/annotator.css',
    }
  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('dist', ['concat:distJS', 'concat:distCSS']);

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin','dist']);

};