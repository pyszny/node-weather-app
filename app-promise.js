const yargs = require('yargs');                                         //npm install yargs --save
const axios = require('axios');
const fs = require('fs');

const argv = yargs
    .options({                                                          //http://yargs.js.org/docs/#api-optionskey-opt
        a: {                                                            //configuration of option a
            demand: !fs.existsSync('address.json'),
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        },
        d: {
            alias: 'default',
            describe: 'Set default address',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

if(argv.default) {
    fs.writeFileSync('address.json', JSON.stringify(argv.default));
}

let generateGeocode = () => {
    if (argv.address) {
        let encodedAddress = encodeURIComponent(argv.address);
        return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAmKqM4rVzlnWXYGK1b737qtlec0xXu7gY`;
    } else {
        let addressString = fs.readFileSync('address.json');
        let encodedAddress = encodeURIComponent(JSON.parse(addressString));
        return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAmKqM4rVzlnWXYGK1b737qtlec0xXu7gY`;
    }
};


axios.get(generateGeocode()).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address.');                //when this execustes, function moves to .catch and catches that error
    }
    let lat = response.data.results[0].geometry.location.lat;
    let lng = response.data.results[0].geometry.location.lng;
    let weatherUrl = `https://api.darksky.net/forecast/538db17832945e23cf16e896176c3c2c/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response) => {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers');
    } else {
        console.log(e.message);
    }
});



