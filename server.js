var Hapi = require('hapi');
var Vision = require('vision');
var Path = require('path');
var Request = require('request');
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});

server.register(Vision, function () {});

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'steam')
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(req, res) {
        res.view('steam')
    }
});
                                                          
server.route({
    method: 'GET',
    path: '/{name}',
    handler: function(req, res) {                                                          
        var steamlink = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=87B2574543BE3EB039BDBC7463A13D68&vanityurl="+ req.params.name;
        var username = req.params.name;
        Request(steamlink, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                var id = body.response.steamid;
                res.view('respuesta', {  
                id: id                
                });
            }
        });


    }
});
server.start(() => {
    console.log('Servidor corriendo en:', server.info.uri);
});