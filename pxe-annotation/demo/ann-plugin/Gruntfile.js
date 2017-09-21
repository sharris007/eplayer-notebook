module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        build: {
            files: {
                'output/annotator.min.js': ["src/lib/vendor/linkify.js","src/lib/vendor/linkify-string.js","src/lib/vendor/json2.js","src/lib/util.js","src/lib/console.js","src/lib/class.js","src/lib/range.js","src/lib/annotator.js","src/lib/widget.js","src/lib/editor.js","src/lib/viewer.js","src/lib/notification.js","src/lib/xpath.js","src/lib/plugin/store.js","src/lib/plugin/permissions.js","src/lib/plugin/annotateitpermissions.js","src/lib/plugin/auth.js","src/lib/plugin/tags.js","src/lib/plugin/unsupported.js","src/lib/plugin/filter.js"],

                'output/pdfannotator.min.js' : ["src/lib/pdfannotator.js"],

                'output/instructor-annotator/instructor-annotator.min.js' : ["src/instructor/lib/vendor/linkify.js", "src/instructor/lib/vendor/linkify-string.js", "src/instructor/lib/vendor/json2.js","src/instructor/lib/util.js","src/instructor/lib/console.js","src/instructor/lib/class.js","src/instructor/lib/range.js","src/instructor/lib/annotator.js","src/instructor/lib/widget.js","src/instructor/lib/editor.js","src/instructor/lib/viewer.js","src/instructor/lib/notification.js","src/instructor/lib/xpath.js","src/instructor/lib/plugin/store.js","src/instructor/lib/plugin/permissions.js","src/instructor/lib/plugin/annotateitpermissions.js","src/instructor/lib/plugin/auth.js","src/instructor/lib/plugin/tags.js","src/instructor/lib/plugin/unsupported.js","src/instructor/lib/plugin/filter.js"]
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
          'output/annotator.min.css':["src/css/annotator.css"],
          'output/instructor-annotator/instructor-annotator.min.css' : ["src/instructor/css/instructor-annotator.css"]
        }
      }
    },
    concat: {
    options: {
      separator: ';',
    },
    distJS: {
      src: ["src/lib/annotation-locale.js","src/lib/vendor/linkify.js","src/lib/vendor/linkify-string.js", "src/lib/vendor/json2.js","src/lib/util.js","src/lib/console.js","src/lib/class.js","src/lib/range.js","src/lib/annotator.js","src/lib/widget.js","src/lib/editor.js","src/lib/viewer.js","src/lib/notification.js","src/lib/xpath.js","src/lib/plugin/store.js","src/lib/plugin/permissions.js","src/lib/plugin/annotateitpermissions.js","src/lib/plugin/auth.js","src/lib/plugin/tags.js","src/lib/plugin/unsupported.js","src/lib/plugin/filter.js"],
      dest: 'output/annotator.js',
    },
    distPdfJS: {
      src: ["src/lib/pdfannotator.js"],
      dest: 'output/pdfannotator.js',
    },
    distCSS : {
      src: ["src/css/annotator.css"],
      dest: 'output/annotator.css',
    },
    distInstructorJS: {
      src: ["src/instructor/lib/annotation-locale.js","src/instructor/lib/vendor/linkify.js", "src/instructor/lib/vendor/linkify-string.js", "src/instructor/lib/vendor/json2.js","src/instructor/lib/util.js","src/instructor/lib/console.js","src/instructor/lib/class.js","src/instructor/lib/range.js","src/instructor/lib/annotator.js","src/instructor/lib/widget.js","src/instructor/lib/editor.js","src/instructor/lib/viewer.js","src/instructor/lib/notification.js","src/instructor/lib/xpath.js","src/instructor/lib/plugin/store.js","src/instructor/lib/plugin/permissions.js","src/instructor/lib/plugin/annotateitpermissions.js","src/instructor/lib/plugin/auth.js","src/instructor/lib/plugin/tags.js","src/instructor/lib/plugin/unsupported.js","src/instructor/lib/plugin/filter.js"],
      dest : "output/instructor-annotator/instructor-annotator.js"
    },
    distInstructorCSS: {
      src: ["src/instructor/css/instructor-annotator.css"],
      dest : "output/instructor-annotator/instructor-annotator.css"
    }
  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('dist', ['concat:distJS','concat:distPdfJS','concat:distCSS', 'concat:distInstructorJS', 'concat:distInstructorCSS']);

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin','dist']);

};