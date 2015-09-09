var bg,fg;
var bgCtx, fgCtx;

var stage=[
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 0, 0, 0, 0, 0, 0, 9],
[9, 9, 9, 9, 9, 9, 9, 9],
];

var stageDiff=[
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
];

var dropping=[[0,0],[0,0]];

var frameTimer=new Date();
var dropTimer=new Date();
var eventTimer=new Date();
var updateDelay=1000/60;
var dropDelay=1000;
var eventDelay=80;

var isPushed={left: false, up: false, right: false, down: false, z:false, x:false};
var eventTimer={left: 0, up: 0, right: 0, down: 0, z: 0, x:0};
var dropState=0,DROPPING=0,CLEAR_LINE=1,SLIDE_BLOCKS=2;

var dx=3;
var dy=0;

var white=new Image();
white.src="white_stone.png";

var black=new Image();
black.src="black_stone.png";

var frame=new Image();
frame.src="frame.png";


window.onload=function(){
	bg=document.getElementById("bg");
	bg.width=360;bg.height=640;
	fg=document.getElementById("fg");
	fg.width=360;fg.height=640;

	bgCtx=bg.getContext("2d");
	fgCtx=fg.getContext("2d");

	drawStage();
	newDropping();
	gameLoop();

	setEventListener();
};

function drawStage(){
	bgCtx.fillStyle="black";
	bgCtx.fillRect(0, 0, bg.width, bg.height);
	bgCtx.fillStyle="green";
	bgCtx.fillRect(30, 0, 300, 640);
}

function drawBlocks(){
	for(var i=0;i<stage.length;i++){
		for(var j=1;j<stage[i].length-1;j++){
			switch(stage[i][j]){
				case 1: //white
					fgCtx.drawImage(white, j*50-20, i*50+40);
				break;
				case 2: //black
					fgCtx.drawImage(black, j*50-20, i*50+40);
				break;
				default:
				break; //none
			}
		}
	}
}

function drawDropping(){
	
	fgCtx.globalAlpha=0.5;
	fgCtx.drawImage(frame, dx*50-20, dy*50+40);
	for(var i=0;i<dropping.length;i++){
		for(var j=0;j<dropping[i].length;j++){
			switch(dropping[i][j]){
				case 1: //white
					fgCtx.drawImage(white, (dx+j)*50-20, (dy+i)*50+40);
				break;
				case 2: //black
					fgCtx.drawImage(black, (dx+j)*50-20, (dy+i)*50+40);
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
		for(var i=1;i>=0;i--){
			for(var j=1;j>=0;j--){
				if(dropping[i][j]>0){
					var collision=false;
					var fy=0;
					while(collision==false){
						if(stage[dy+i+fy+1][dx+j]>0){
							collision=true;
						}else{
							fy++;
						}
					}
					stage[dy+i+fy][dx+j]=dropping[i][j];
				}
			}
		}

		var isCleared=false;
		while(isCleared==false){
			if(clearHorizontal()+clearVertical()==0)isCleared=true;
			applyDiff();
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

	var shape=[[0,0],[0,0]];
	var combi=[0,0,0,0];
	var rep=0;

	var stone=0;

	for(var i=0;i<3;i++){
		var c=Math.random()*3|0;
		if(c>0){
			combi[i]=c;
			stone++;
		}
	}
	if(stone==0){
		combi[3]=1+(Math.random()*2|0);
	}else{
		combi[3]=Math.random()*3|0;
	}

	for(var i=0;i<shape.length;i++){
		for(var j=0;j<shape[i].length;j++){
				shape[i][j]=combi[rep];
				rep++;
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
	var t=[[0,0],[0,0]];
	var collisionRotate=false;
	var collisionLeft=false;
	var collisionRight=false;
	for(var i=0;i<2;i++){
		for(var j=0;j<2;j++){
			t[j][dropping.length-i-1]=dropping[i][j];
		}
	}
	for(var i=0;i<2;i++){
		for(var j=0;j<2;j++){
			if(t[i][j]>0 && stage[dy+i][dx+j]>0){
				collisionRotate=true;
				break;
			}
		}
	}

	if(collisionRotate){
		for(var i=0;i<2;i++){
			for(var j=0;j<2;j++){
				if(t[i][j]>0 && stage[dy+i][dx+j-1]>0){
					collisionLeft=true;
				}
			}
		}
		if(collisionLeft || dx<1){
			console.log("collision left");
			for(var i=0;i<2;i++){
				for(var j=0;j<2;j++){
					if(t[i][j]>0 && stage[dy+i][dx+j+1]>0){
						collisionRight=true;
					}
				}
			}
			if(collisionRight){}else{
				dropping=t;
				dx++;
			}
		}else{
			dropping=t;
			dx--;
		}
	}else{
		dropping=t;
	}
}

function rotateRight(){
	var t=[[0,0],[0,0]];
	var collisionRotate=false;
	var collisionLeft=false;
	var collisionRight=false;
	for(var i=0;i<2;i++){
		for(var j=0;j<2;j++){
			t[dropping[i].length-j-1][i]=dropping[i][j];
		}
	}
	for(var i=0;i<2;i++){
		for(var j=0;j<2;j++){
			if(t[i][j]>0 && stage[dy+i][dx+j]>0){
				collisionRotate=true;
				break;
			}
		}
	}

	if(collisionRotate){
		for(var i=0;i<2;i++){
			for(var j=0;j<2;j++){
				if(t[i][j]>0 && stage[dy+i][dx+j-1]>0){
					collisionLeft=true;
				}
			}
		}
		if(collisionLeft || dx<1){
			console.log("collision left");
			for(var i=0;i<2;i++){
				for(var j=0;j<2;j++){
					if(t[i][j]>0 && stage[dy+i][dx+j+1]>0){
						collisionRight=true;
					}
				}
			}
			if(collisionRight){}else{
				dropping=t;
				dx++;
			}
		}else{
			dropping=t;
			dx--;
		}
	}else{
		dropping=t;
	}
}

function update(){
	var isCollide=false;
	if(dropState==DROPPING){
		var now=new Date();
		if(isPushed.left && now - eventTimer.left > eventDelay){
			if(checkCollide(dx-1, dy)===false){
				dx--;
				eventTimer.left=now;
			}
		}else if(isPushed.right && now - eventTimer.right > eventDelay){
			if(checkCollide(dx+1, dy)===false){
				dx++;
				eventTimer.right=now;
			}
		}else if(isPushed.up && now - eventTimer.up > eventDelay){
			while(isCollide===false){
				if(dropBlock()===true)isCollide=true;
			}
			eventTimer.up=now;
		}else if(isPushed.down && now - eventTimer.down > eventDelay){
			dropBlock();
			dropTimer=new Date();
			eventTimer.down=now;
		}else if(isPushed.z && now - eventTimer.z > eventDelay){
			rotateLeft();
			eventTimer.z=now;
		}else if(isPushed.x && now - eventTimer.x > eventDelay){
			rotateRight();
			eventTimer.x=now;
		}
	}
	//横１列消し?
	if(new Date() - dropTimer>dropDelay){
		dropBlock();
		dropTimer=new Date();
	}
}


function clearHorizontal(){
	var beforeColor=0;
	var match=0;
	var bondStart=0;
	var isBond=false;
	var line=0;

	for(var i=stage.length-2;i>=0;i--){
		match=0;
		for(var j=0;j<stage[i].length;j++){
			if(stage[i][j] > 0 && stage[i][j] == beforeColor){
				match++;
			}else{
				if(match>=5){
					for(var k=0;k<match;k++){
						stageDiff[i][bondStart+k]=1;
					}
					line++;
				}
				bondStart=j;
				beforeColor=stage[i][j];
				match=1;
			}
		}
	}

	return line;
}

function clearVertical(){
	var beforeColor=0;
	var match=0;
	var bondStart=0;
	var isBond=false;
	var line=0;

	for(var j=stage[0].length-2;j>=0;j--){
		match=0;
		for(var i=stage.length-2;i>=0;i--){
			if(stage[i][j] > 0 && stage[i][j] == beforeColor){
				match++;
			}else{
				if(match>=5){
					for(var k=0;k<match;k++){
						stageDiff[bondStart-k][j]=1;
					}
					line++;
				}
				bondStart=i;
				beforeColor=stage[i][j];
				match=1;
			}
		}
	}

	return line;
}

function applyDiff(){
	for(var i=0;i<stage.length;i++){
		for(var j=0;j<stage[i].length;j++){
			if(stageDiff[i][j]==1){
				stage[i][j]=0;
				stageDiff[i][j]=0;
			}
		}
	}
	pushBlocks();
}

function pushBlocks(){
	var collision=false;
	var fy=0;
	for(var i=stage.length-2;i>=0;i--){
		for(var j=0;j<stage[i].length;j++){
			if(stage[i][j]>0){
				collision=false;
				fy=0;
				while(collision==false){
					if(stage[i+fy+1][j]>0){
						collision=true;
					}else{
						fy++;
					}
				}
				if(fy>0){
					stage[i+fy][j]=stage[i][j];
					stage[i][j]=0;
				}
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
			case 88:
				isPushed.x=true;
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
			case 88:
				isPushed.x=false;
			break;
			default:
			break;
		}
	};

}