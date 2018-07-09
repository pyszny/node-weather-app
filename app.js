const yargs = require('yargs');                                         //npm install yargs --save

const geocode = require('./geocode/geocode.js');                        //require geocode file
const weather = require('./weather/weather.js');

const argv = yargs
    .options({                                                          //http://yargs.js.org/docs/#api-optionskey-opt
        a: {                                                            //configuration of option a
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(results.address);
        weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
            if (errorMessage) {
                console.log(errorMessage);
            } else {
                console.log(`It's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`);
            }
        });
    }
});



