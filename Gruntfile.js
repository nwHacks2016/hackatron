module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadTasks('./tasks');

    grunt.initConfig({

        examples: {
            all: {
            options: {
                base: 'game',
                excludes: ['_site', 'assets', 'states', 'wip']
            },
            src: ['game/**/*.js'],
            dest: 'game/_site/game.json'
            }
        },

        connect: {
            root: {
                options: {
                    keepalive: true,
                    hostname: '*',
                    port: 8001
                }
            }
        }

    });

    grunt.registerTask('default', ['game']);

};
