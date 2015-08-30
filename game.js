var bg,fg;
var bgCtx, fgCtx;

var stage=[
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 9],
[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
];

var dropping=[
	[1, 2, 0],
	[0, 1, 2],
];

var blockShapes=[
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
	],
	[
		[0, 1, 0, 0],
		[1, 1, 1, 0],
	],
	[
		[0, 1, 1, 0],
		[1, 1, 0, 0],
	],
	[
		[1, 1, 0, 0],
		[0, 1, 1, 0],
	],
	[
		[1, 0, 0, 0],
		[1, 1, 1, 0],
	],
	[
		[0, 0, 1, 0],
		[1, 1, 1, 0],
	],
	[
		[0, 1, 1, 0],
		[0, 1, 1, 0],
	]
];








var frameTimer=new Date();
var dropTimer=new Date();
var eventTimer=new Date();
var updateDelay=1000/60;
var dropDelay=500;
var eventDelay=60;

var isPushed={left: false, up: false, right: false, down: false, z:false};

var dropState=0,DROPPING=0,CLEAR_LINE=1,SLIDE_BLOCKS=2;

var dx=3;
var dy=0;

var white=new Image();
white.src="white.png";

var black=new Image();
black.src="black.png";


window.onload=function(){
	bg=document.getElementById("bg");
	bg.width=360;bg.height=640;
	fg=document.getElementById("fg");
	fg.width=360;fg.height=640;

	bgCtx=bg.getContext("2d");
	fgCtx=fg.getContext("2d");

	drawStage();
	gameLoop();

	setEventListener();
};

function drawStage(){
	bgCtx.fillStyle="black";
	bgCtx.fillRect(0, 0, bg.width, bg.height);
	bgCtx.fillStyle="green";
	bgCtx.fillRect(20, 0, 320, 640);
}

function drawBlocks(){
	for(var i=0;i<stage.length;i++){
		for(var j=1;j<stage[i].length-1;j++){
			switch(stage[i][j]){
				case 1: //white
					fgCtx.drawImage(white, j*32-12, i*32);
				break;
				case 2: //black
					fgCtx.drawImage(black, j*32-12, i*32);
				break;
				default:
				break; //none
			}
		}
	}
}

function drawDropping(){
	fgCtx.globalAlpha=0.5;
	for(var i=0;i<dropping.length;i++){
		for(var j=0;j<dropping[i].length;j++){
			switch(dropping[i][j]){
				case 1: //white
					fgCtx.drawImage(white, (dx+j)*32-12, (dy+i)*32);
				break;
				case 2: //black
					fgCtx.drawImage(black, (dx+j)*32-12, (dy+i)*32);
				break;
				default: //none
				break;
			}
		}
	}
	fgCtx.globalAlpha=1;
}

function clearFg(){
	fgCtx.clearRect(0, 0, fg.width, fg.height);
}

function dropBlock(){
	if(checkCollide(dx, dy+1)){
		for(var i=0;i<dropping.length;i++){
			for(var j=0;j<dropping[i].length;j++){
				if(dropping[i][j]>0)stage[dy+i][dx+j]=dropping[i][j];
			}
		}
		newDropping();
		return true;
	}else{
		dy++;
	}
}
function newDropping(){
	dy=0;
	dx=3;

	var shape=blockShapes[blockShapes.length*Math.random()|0];
	var combi=[0,0,0,0];
	var rep=0;

	for(var i=0;i<4;i++){
		combi[i]=1+(Math.random()*2|0);
	}
	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape[i].length;j++){
			if(shape[i][j]>0){
				shape[i][j]=combi[rep];
				rep++;
			}
		}
	}

	dropping=shape;
}

function checkCollide(cx, cy){
	var collision=false;
	for(var i=0;i<dropping.length;i++){
		for(var j=0;j<dropping[i].length;j++){
			if(dropping[i][j]>0 && stage[cy+i][cx+j]>0){
				collision=true;
				break;
			}
		}
	}
	return collision;
}

function rotateLeft(){
	var t=[];
	for(var i=0;i<dropping.length;i++){
		for(var j=0;j<dropping[i].length;j++){
			t[j][i]=dropping[i][j];
		}
	}
	dropping=t;
}

function update(){
	var isCollide=false;
	if(new Date() - eventTimer>eventDelay && dropState==DROPPING){
		if(isPushed.left){
			if(checkCollide(dx-1, dy)==false)dx--;
		}else if(isPushed.right){
			if(checkCollide(dx+1, dy)==false)dx++;
		}else if(isPushed.up){
			while(isCollide==false){
				if(dropBlock()==true)isCollide=true;
			};
		}else if(isPushed.down){
			dropBlock();
			dropTimer=new Date();
		}
		eventTimer=new Date();
	}
	//横の移動阻止判定
	//横１列消し?
	if(new Date() - dropTimer>dropDelay){
		dropBlock();
		dropTimer=new Date();
	}
}


function clearHorizontal(){
	var beforeColor=0;//1white 2black
	var bondStart=0;
	var isBond=false;

	//white
	for(var i=0;i<stage.length;i++){
		for(var j=0;j<stage[i].length;j++){
			switch(stage[i][j]){
				case 1:
					if(beforeColor==1){
						isBond=true;
					}
				break;
				case 2:
				break;
				default:
				break;
			}
		}
	}
}


function gameLoop(){
	if(new Date() - frameTimer>updateDelay){
		update();
		clearFg();
		drawBlocks();
		if(dropState==DROPPING)drawDropping();
		frameTimer=new Date();
	}
	requestAnimationFrame(gameLoop);
}


function setEventListener(){
	document.onkeydown = function(e){
		e=e?e:window.event;
		switch(e.keyCode){
			case 37:
				isPushed.left=true;
			break;
			case 38:
				isPushed.up=true;
			break;
			case 39:
				isPushed.right=true;
			break;
			case 40:
				isPushed.down=true;
			break;
			case 90:
				isPushed.z=true;
			break;
			default:
			break;
		}
	};
	document.onkeyup = function(e){
		e=e?e:window.event;
		switch(e.keyCode){
			case 37:
				isPushed.left=false;
			break;
			case 38:
				isPushed.up=false;
			break;
			case 39:
				isPushed.right=false;
			break;
			case 40:
				isPushed.down=false;
			break;
			case 90:
				isPushed.z=false;
			break;
			default:
			break;
		}
	};

}