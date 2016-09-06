//variables globales
var timeMs = 80;
var size= 10; 

class objet{
	constructor(){
		this.size = size;
	}
	collision(obj){
		var difx = Math.abs(this.x = obj.x);
		var dify = Math.abs(this.y = obj.y);
		if(difx >= 0 && difx <size && dify >= 0 && dify < size){
			return true;
		}
		else
			return false;
	}

} // Téte du snake
class Tail extends objet{
	constructor(x,y){
		super();
		this.x = x;
		this.y = y;
		this.siguiente = null;
	}
	draw(ctx){
		if(this.siguiente != null){
			this.siguiente.draw(ctx);
		}
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
	setxy(x, y){
		if (this.siguiente != null){
			this.siguiente.setxy(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	meter(){
		if(this.siguiente == null){
			this.siguiente = new Tail(this.x, this.y);
		}else{
			this.siguiente.meter();
		}
	}

}
class setfood extends objet{
	constructor(){
		super();
		this.x = this.generate();
		this.y = this.generate();
	}
	 generate(){
		var num = (Math.floor(Math.random() * 59)) * 10;
		return num;
	}
	position(){
		this.x = this.generate();
		this.y = this.generate();
	}
	draw(ctx){
		ctx.fillStyle = ("#FF0000");
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}
// objet du jeu
var player = new Tail(20, 20); // Nouvel élément positionner à 20 sur l'axe des x et 20 sur l'axe des y (voir méthode draw).
var food = new setfood();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;

function move(){
	var nx =  player.x+xdir;
	var ny = player.y+ydir;
	player.setxy(nx, ny);
}


function control(event){
	var code = event.keyCode;
	if(ejex){
		if(code == 38){
			ydir = -size;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	
		if(code == 40){
			ydir = size;
			xdir = 0;
			ejex = false;
			ejey = true;
		}

	}
	if(ejey){
		if(code == 37){
			ydir = 0;
			xdir = -size;
			ejey = false;
			ejex = true;
			
		}

	
		if(code == 39){
			ydir = 0;
			xdir = size;
			ejey = false;
			ejex = true;
		
		}
	}
	
}

function draw(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);
	player.draw(ctx);
	food.draw(ctx);
}
function main(){
	draw();
	move();
	if(player.collision(food)){
		food.position();
		player.meter();
	}

}
setInterval("main()", timeMs);