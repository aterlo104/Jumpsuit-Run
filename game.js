// SELECT CVS
const cvs = document.getElementById("jumpsuit");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
let isMoving = false;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "img/spriites.png";

// LOAD SOUNDS
const BACK_S = new Audio();
BACK_S.src = "audio/sfx_main.mp3";

const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 500,
    y : 273,
    w : 83,
    h : 29
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if(tyler.y - tyler.radius <= 0) return;
            tyler.flap();
            BACK_S.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                flowers.reset();
                rocks.reset();
                tyler.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});

document.addEventListener("keydown",keyDownHandler, false);	
document.addEventListener("keyup",keyUpHandler, false);	

//Key Handlers
function keyDownHandler(event){
	var keyPressed = String.fromCharCode(event.keyCode);

	if (keyPressed == "W"){		
		facing = "N";
		isMoving = true;	
	}
	else if (keyPressed == "S"){	
		facing = "S";
		isMoving = true;		
	}
}

function keyUpHandler(event){
    var keyPressed = String.fromCharCode(event.keyCode);
    
	if ((keyPressed == "W") || (keyPressed == "S")){
		isMoving = false;
	}
}

// BACKGROUND
const bg = {
    sX : 1,
    sY : 0,
    w : 220,
    h : 226,
    x : 0,
    y : cvs.height - 360,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 2 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 3 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 4 * this.w, this.y, this.w, this.h);
    }
    
}

// FOREGROUND
const fg = {
    sX: 1,
    sY: 229,
    w: 300,
    h: 150,
    x: 0,
    y: 240,
    
    dx : 2,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 2 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 3 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 4 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 5 * this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// NICO
const nico = {
    animation : [
        {sX: 1, sY : 416},
        {sX: 125, sY : 416},
        {sX: 250, sY : 416},
        {sX: 125, sY : 416}
    ],
    x : 0,
    y : 240,
    w : 125,
    h : 100,
    frame : 0,

    draw: function(){
        let nico = this.animation[this.frame];
        ctx.drawImage(sprite, nico.sX, nico.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    },

    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE tyler MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        if(state.current == state.game){
            this.y = tyler.y - 50;
        }
        if(state.current == state.over){
            this.frame = 0;
        }
    }
}

// TYLER
const tyler = {
    animation : [
        {sX: 305, sY : 330},
        {sX: 405, sY : 330},
        {sX: 505, sY : 330},
        {sX: 405, sY : 330}
    ],
    x : 200,
    y : 300,
    w : 100,
    h : 75,
    
    radius : 12,
    frame : 0,
    gravity : 0.1,
    jump : 3,
    speed : 0,
    rotation : 0,
    move : 3,
    
    draw : function(){
        let tyler = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, tyler.sX, tyler.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        if(this.x + this.radius < 1000){
            this.speed = - this.jump;
        }
    },

    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE tyler MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.x = 200;
            this.y = 300; // RESET POSITION OF THE tyler AFTER GAME OVER
        }else{
            this.speed += this.gravity;
            this.x -=this.speed;

            if(this.x - this.w/2 <= nico.w){
                this.x = nico.w + this.w/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }
        }
        if(state.current == state.over){
            this.frame = 2;
        }
        if (isMoving){
            if (facing == "N" && this.y - 20 > fg.y){
                this.y -= this.move;
            }
            else if (facing == "S" && this.y + 50 < fg.y + fg.h){
                this.y += this.move;
            }
        }
    },
    speedReset : function(){
        this.speed = 0;
    }
}

// FLOWERS
const flowers = {
    position : [],
    
    top : {
        sX : 235,
        sY : 185
    },    
    w : 47,
    h : 36,
    gap : 35,
    maxYPos : 80,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%80 == 0){
            this.position.push({
                x : cvs.width,
                y : 170 + this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            // COLLISION DETECTION
            if(tyler.x + tyler.radius > p.x && tyler.x - tyler.radius < p.x + this.w && tyler.y + tyler.radius > p.y && tyler.y - tyler.radius < p.y + this.h){
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
                this.position.shift();
            }
            
            // MOVE THE flowers TO THE LEFT
            p.x -= this.dx;
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// ROCKS
const rocks = {
    position : [],
    
    top : {
        sX : 238,
        sY : 144
    },    
    w : 40,
    h : 36,
    gap : 35,
    maxYPos : 80,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%80 == 0){
            this.position.push({
                x : cvs.width,
                y : 170 + this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            // COLLISION DETECTION
            if(tyler.x + tyler.radius > p.x && tyler.x - tyler.radius < p.x + this.w && tyler.y + tyler.radius > p.y && tyler.y - tyler.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            
            // MOVE THE ROCKS TO THE LEFT
            p.x -= this.dx;
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// GET READY MESSAGE
const getReady = {
    sX : 13,
    sY : 510,
    w : 228,
    h : 205,
    x : cvs.width/2 - 210/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

// GAME OVER MESSAGE
const gameOver = {
    sX : 307,
    sY : 118,
    w : 235,
    h : 206,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}

// SCORE
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
            
        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 503, 237);
            ctx.strokeText(this.value, 503, 237);
            // BEST SCORE
            ctx.fillText(this.best, 567, 237);
            ctx.strokeText(this.best, 567, 237);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

// DRAW
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    fg.draw();
    nico.draw();
    tyler.draw();
    flowers.draw();
    rocks.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    tyler.update();
    nico.update();
    fg.update();
    flowers.update();
    rocks.update();
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();
