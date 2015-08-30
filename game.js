var bg,fg;
var bgCtx, fgCtx;

var stage=[
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 2, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
[0, 0, 0, 0, 2, 0, 2, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
];

var dropping=[
	[1, 2],
	[0, 1, 2],
];

var blockShapes=[
	[
		[1,1,1,1],
	],
	[
		[1,1,1],
		[0,1,0]
	],
	[
		[0,1,1],
		[1,1,0]
	],
	[
		[1,1],
		[1,1]
	]
];








var frameTimer=new Date();
var dropTimer=new Date();
var eventTimer=new Date();
var updateDelay=1000/60;
var dropDelay=500;
var eventDelay=100;

var isPushed={left: false, up: false, right: false, down: false};

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
		for(var j=0;j<stage[i].length;j++){
			switch(stage[i][j]){
				case 1: //white
					fgCtx.drawImage(white, 20+j*32, i*32);
				break;
				case 2: //black
					fgCtx.drawImage(black, 20+j*32, i*32);
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
					fgCtx.drawImage(white, 20+(dx+j)*32, (dy+i)*32);
				break;
				case 2: //black
					fgCtx.drawImage(black, 20+(dx+j)*32, (dy+i)*32);
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
	var conflict=false;

	for(var i=0;i<dropping.length;i++){
		for(var j=0;j<dropping[i].length;j++){
			if(dropping[i][j]>0 && stage[dy+i+1][dx+j]>0){
				conflict=true;
				break;
			}
		}
	}
	if(conflict){
		for(var i=0;i<dropping.length;i++){
			for(var j=0;j<dropping[i].length;j++){
				if(dropping[i][j]>0)stage[dy+i][dx+j]=dropping[i][j];
				
			}
		}
		newDropping();
	}else{
		dy++;
	}
}
function newDropping(){
	dy=0;
	dx=3;

	var shape=blockShapes[blockShapes.length*Math.random()|0];
	var combi=[0,0,0,0];
	var replace=0;

	for(var i=0;i<4;i++){
		combi[i]=1+(Math.random()*2|0);
	}
	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape[i].length;j++){
			if(shape[i][j]>0)shape[i][j]=combi[replace];
			console.log(combi[replace]);
			replace++;
		}
	}

	dropping=shape;
}

function update(){
	if(new Date() - eventTimer>eventDelay && dropState==DROPPING){
		if(isPushed.left){
			dx--;
			if(dx<0)dx=0;
		}else if(isPushed.right){
			dx++;
			if(dx>9)dx=9;
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
			default:
			break;
		}
	};

}