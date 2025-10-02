const events = require("events");
const ws = require("ws");

class Server extends events.EventEmitter {
	constructor(){
		super()

		const _this = this;
		Server.fhttp.call(_this);
		Server.fws.call(_this);
	}
}

Server.evpass = function(ev, target, pass){
	if(pass)
		return function(...args){
			target.emit(ev, this, ...args);
		}
	else
		return function(...args){
			target.emit(ev, ...args);
		}
}

Server.fhttp = function(){
	const _this = this;
	const hserv = http.createServer();
	hserv.on("request", function(req, res){
		_this.emit("request", req, res)
	});
	hserv.on("upgrade", function(...args){
		_this.emit("upgrade", ...args);
	});
	hserv.listen(8000);
}

Server.fws = function(){
	const _this = this;
	const wserv = new ws.WebSocketServer({
		noServer: true
	});
	this.wss = wserv;
	wserv.on("connection", function(ws, req, client){
		ws.on("error", Server.evpass("ws-error", _this, 1));
		ws.on("message", Server.evpass("ws-message", _this, 1));
	});
}

const http = require("http");
const pages = require("game/pages");
const server = new Server();

server.on("request", function(req, res){
	console.log(req.method);
	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	this.emit(req.method.toLowerCase(), req, res);

	if(res.writableEnded || res.lock)
		return ;

	res.end("SERVER_ERROR");
});

server.on("upgrade", function(request, socket, head){
	//console.log("[socket] Upgrade requested.");
	//socket.on("error", console.error);
	socket.on("error", Server.evpass("ws-socket-error", this));
	const _this = this;
	this.emit("ws-auth", request, socket, head, function(client){
		const { wss } = _this;
		wss.handleUpgrade(request, socket, head, function done(ws) {
			console.log("[socket] Upgraded!");
			wss.emit('connection', ws, request, client);
		});
	});
});

server.on("ws-auth", function(request, socket, head, pass){
	console.log(request);
	pass({});
});

server.on("ws-error", function(ws, err){

});

server.on("ws-message", function(ws, data){
	console.log(ws.username);
	const text = data.toString();
	if(text.startsWith("username"))
		ws.username = text.split("username")
			.slice(1)
			.join('username')
		;
});

server.on("post", function(){

});

server.on("get", function(req, res){
	if(res.writableEnded)
		return ;

	res.lock = 1;

	new Promise(async function(rs){
		const { url } = req;
		const _ = url.startsWith.bind(url);

		if(_("/singleton")){
			// single html file mode so
			// browser caching can just piss off
			let singleton = await pages["index.html"];
			singleton = singleton.replaceAll(
				"$_SINGLETON_CSS",
				await pages["style.css"]
			);
			singleton = singleton.replaceAll(
				"$_SINGLETON_JS",
				await pages["script.js"]
			);
			res.end(singleton);
		}

		if(_("/anim/")){
			const name = url.split('/').slice(-1);
			res.end(await pages[`anim_${name}`]);
		}

		if(_("/index.html")){
			res.end(await pages["index.html"]);
		} else if(_("/script.js")){
			res.end(await pages["script.js"]);
		} else if(_("/style.css")){
			res.end(await pages["style.css"]);
		} else if(url.endsWith("/")){
			res.end(await pages["index.html"]);
		}

		if(res.writableEnded)
			return ;

		res.writeHead(404);
		res.end(await pages["404"]);
		rs();

	});
});

server.on("player", function(){

});
