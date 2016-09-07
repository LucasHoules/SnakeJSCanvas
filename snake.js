//Variables globales
var speed = 80;
var size = 10;

class objet {
	constructor(){
		this.size = size;
	}
	//// Méthode calculant si l'objet passer en paramètre est entré en collision avec l'objet en cours ////
	collision(obj){
		var difx = Math.abs(this.x - obj.x);
		var dify = Math.abs(this.y - obj.y);
		if(difx >= 0 && difx < size && dify >= 0 && dify < size){
			return true;
		} else {
			return false;
		}
	}
}

class Player extends objet {
	constructor(x,y){
		super();
		this.x = x;
		this.y = y;
		this.following = null;

	}
	//// Méthode qui dessine le snake qui lui n'est pas positionner aléatoirement comme la nourriture ////
	draw(ctx){
		//// on redessine un cube pour agrandir le snake ////
		if(this.following != null){
			this.following.draw(ctx);
		}
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
	//// Modifie la position du snake (utiliser pour le déplacer) ////
	//// On replace un bout de snake a sa nouvelle position ////
	setxy(x,y){
		if(this.following != null){
			this.following.setxy(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	meter(){
		if(this.following == null){
			this.following = new Player(this.x, this.y);
		} else {
			this.following.meter();
		}
	}
	snakeFollowing(){
		return this.following;
	}
}

class setFood extends objet {
	constructor(){
		super();
		this.x = this.generate();
		this.y = this.generate();
	}
	//// Méthode de classe qui génére un nombre aléatoire. Math.floor arrondi à l'entier supérieur,////
	//// random un nombre aléatoire entre [0, 1] multiplier par 59 et 10 pour générer un nombre entre 0 et 590 ////
	generate(){
		var num = (Math.floor(Math.random() * 59))*10;
		return num;
	}
	//// modifie la position de la nourriture alétoirement en rappellant la méthode generate ////
	position(){
		this.x = this.generate();
		this.y = this.generate();
	}
	//// Méthode qui dessine la nourriture x et y seront égal a notre nombre aléatoire générer précedemment.
	draw(ctx){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}
//Instancation des objets/ variables.
var player = new Player(20,20);
var food = new setFood();
//// ses 2 booléins sont utiliser pour interdire les déplacement verticaux quand on a choisi de se déplacer
////en bas ou en haut et les déplacement horizontaux quand on a choisi de se déplacer à gauche et à droite ////
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;
//// Méthode déplacant le snake  ////
function move(){
	// On enregistre d'abord la nouvelle position du snake dans des variables.
	var nx = player.x+xdir;
	var ny = player.y+ydir;
	// On le déplace avec ses nouvelles valeurs.
	player.setxy(nx,ny);
}
function control(event){
	var cod = event.keyCode; // On récupére la touche entrer par l'utilisateur
	if(ejex){
		if(cod == 38){
			ydir = -size;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
		if(cod == 40){
			ydir = size;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	}
	if(ejey){
		if(cod == 37){
			ydir = 0;
			xdir = -size;
			ejey = false;
			ejex = true;
		}
		if(cod == 39){
			ydir = 0;
			xdir = size;
			ejey = false;
			ejex = true;
		}
	}
}
/// Fin du jeu on réanitilise les variables, génére un nouveau snake et de la nouvelle nourriture et on affiche "perdu".
function endGame(){
	xdir = 0;
	ydir = 0;
	ejex = true;
	ejey = true;
	player = new Player(20,20);
	food = new setFood();
	alert("Perdu");
}
//// collision avec les murs 590 car le canvas fait 600 par 600 au quel on enlève les 10 pixels du snake.////
function wallCollision(){
	if(player.x < 0 || player.x > 590 || player.y < 0 || player.y > 590){
		endGame();
	}
}
//// collision avec la queue du snake ////
function tailCollision(){
	var temp = null;
	try{
		temp = player.snakeFollowing().snakeFollowing();
	}catch(err){
		temp = null;
	}
	while(temp != null){
		if(player.collision(temp)){
			//fin du jeu
			endGame();
		} else {
			temp = temp.snakeFollowing();
		}
	}
}
//// Fonction qui dessine la zone de jeu, le joueur et la nourriture////
function draw(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);
	//aquí abajo va todo el dibujo
	player.draw(ctx);
	food.draw(ctx);
}
// function boucle infini de base
function main() {
	tailCollision();
	wallCollision();
	draw();
	move();
	//// Si le snake entre en collision avec la nourriture on regénere de la nourriture aléatoirement (méthode position) ////
	if(player.collision(food)){
		food.position();
		player.meter(); // et biensur on oublie pas d'agrandir le snake.
	}
}
setInterval("main()", speed);
