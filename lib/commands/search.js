var bower = require('bower'),
    chalk = require('chalk'),
    Constants = require('../Constants'),
    Plugin = require('../Plugin');


module.exports = {
    search: function(renderer) {
        var searchTerm = arguments.length >= 3 ? arguments[1] : '',
            done = arguments[arguments.length -1] || function () {};
        
        var plugin = new Plugin(searchTerm);
        var config = { registry: Constants.Registry };

        var resultsFn = function(results){
            if(!results.length) {
                renderer.log(chalk.yellow('no plugins found in registry', plugin.toString(),config.registry));

            }
            results.forEach(function (result) {
                renderer.log(chalk.cyan(result.name) + ' ' + (result.url||result.repo));
            });
            if ((config.registry == Constants.RegistryAlt) || (Constants.RegistryAlt == Constants.Registry))
            {
                done();//we're done after we've done both searches or if one is only needed
            }else
            {
                //Alt recursive step
                config = { registry: Constants.RegistryAlt };
                bower.commands.search(searchTerm,  config)
                .on('end', resultsFn)
                .on('error', errorFn);
            }
        };

        var errorFn = function(err){
            renderer.log(chalk.red("Oh dear, something went wrong. I'm terribly sorry."), err);
            done(err);
        };


        //primary search
        bower.commands.search(searchTerm,  config)
        .on('end', resultsFn)
        .on('error', errorFn);
        
    }
};
