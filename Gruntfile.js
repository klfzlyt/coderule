module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: './public/js/tree.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint:{
        options: {
            curly: true,
            eqeqeq: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            node: true
        },
        globals: {           
            jQuery:true
        },       
        all: ['Gruntfile.js', './public/js/tree.js']          
    },
    watch:{
    	
    	
    	
    }
    
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify','jshint']);

};