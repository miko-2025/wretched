class Game extends EventSystem {
	constructor(url){
		super();
		const _this = this;
		this.players = new GamePlayers();
		this.ws = new WebSocket(url);
		this.ws.addEventListener("open", function(){
			_this.ws.send("usernameMkay");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");
			_this.ws.send("Hi!");

		});
		this.ws.addEventListener("close", function(event){
			//alert(event.code);
		});
		this.ws.addEventListener("error", function(event){
			//alert(event.code);
		});
	}
}

/* GamePlayers Events
	join
	leave
*/
class GamePlayers extends EventSystem {
	constructor(){
		super();
		this.list = [];
	}
}

GamePlayers.prototype.join = function(){

}

GamePlayers.prototype.leave = function(){

}

let game;
async function start(url){
	game = new Game(url);
}

window.addEventListener("DOMContentLoaded", function(){
	start("http://localhost:8000");
});
