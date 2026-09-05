
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const powerFill=document.getElementById('powerFill');
const retryBtn=document.getElementById('retry');

function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);

let ball,hoop,score=0;
let aiming=false,shooting=false,charging=false;
let aimAngle=-Math.PI/3,power=0;
let missStreak=0;

// overlay message state
let overlayMsg='';
let overlayTimer=0;

const gravity=0.35,powerMultiplier=0.28,friction=0.998;

function showOverlay(msg, duration){
 overlayMsg=msg;
 overlayTimer=duration||180; // frames
 overlayAlpha=1;
}

function reset(){
 const g=canvas.height/2;
 ball={x:canvas.width*0.25,y:canvas.height-120,r:12,vx:0,vy:0};
 hoop={x:canvas.width*0.65,y:g-160,w:70,h:6};
 aiming=false;shooting=false;charging=false;
 power=0;powerFill.style.width='0%';
 retryBtn.style.display='none';
}
reset();

function drawCourt(){ctx.fillStyle="#d8b07a";ctx.fillRect(0,canvas.height/2,canvas.width,canvas.height/2)}

function drawHoop(){ctx.fillStyle="#fb923c";ctx.fillRect(hoop.x,hoop.y,hoop.w,hoop.h);ctx.fillStyle="#e5e7eb";ctx.fillRect(hoop.x+hoop.w,hoop.y-90,8,90)}

function drawBall(){ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle="#ea580c";ctx.fill()}

function drawAim(){
 if(!aiming||shooting)return;
 let len=100;
 ctx.beginPath();ctx.moveTo(ball.x,ball.y);
 ctx.lineTo(ball.x+Math.cos(aimAngle)*len,ball.y+Math.sin(aimAngle)*len);
 ctx.strokeStyle="#38bdf8";ctx.lineWidth=3;ctx.stroke();
}

function drawOverlay(){
 if(overlayTimer<=0)return;

 const isLong=overlayMsg.length>30;
 const fontSize=isLong
  ? Math.min(canvas.width/14, 48)
  : Math.min(canvas.width/8, 72);

 ctx.font=`bold ${fontSize}px Arial`;
 ctx.textAlign='center';
 ctx.textBaseline='middle';
 ctx.fillStyle='#f5f5f5';
 ctx.fillText(overlayMsg, canvas.width/2, canvas.height/2);

 overlayTimer--;
}

function update(){
 if(charging){power=Math.min(100,power+1.5);powerFill.style.width=power+'%'}
 if(!shooting)return;

 ball.x+=ball.vx;
 ball.y+=ball.vy;
 ball.vy+=gravity;
 ball.vx*=friction;

 // scored
 if(ball.y>hoop.y && ball.y<hoop.y+20 && ball.x>hoop.x && ball.x<hoop.x+hoop.w && ball.vy>0){
  score++;
  document.getElementById('score').innerText=score;
  missStreak=0;
  showOverlay('HAPPY FATHER\'S DAY', 200);
  reset();
 }

 // missed
 if(ball.y>canvas.height){
  shooting=false;
  missStreak++;
  if(missStreak>=5){
   showOverlay('You suck at this, but HAPPY FATHER\'S DAY', 220);
   missStreak=0;
  }
  retryBtn.style.display='block';
 }
}

retryBtn.onclick=reset;

function updateAim(x,y){
 let dx=x-ball.x;
 let dy=y-ball.y;
 aimAngle=Math.atan2(dy,dx);
 if(aimAngle>-0.2) aimAngle=-0.2;
}

canvas.addEventListener('mousemove',e=>{if(aiming) updateAim(e.clientX,e.clientY)});
canvas.addEventListener('mousedown',()=>{aiming=true;charging=true});
canvas.addEventListener('mouseup',()=>shoot());

canvas.addEventListener('touchstart',e=>{
 let t=e.touches[0];
 aiming=true;charging=true;
 updateAim(t.clientX,t.clientY);
});

canvas.addEventListener('touchmove',e=>{
 let t=e.touches[0];
 if(aiming) updateAim(t.clientX,t.clientY);
});

canvas.addEventListener('touchend',()=>shoot());

function shoot(){
 if(!aiming)return;
 aiming=false;charging=false;
 let strength=power*powerMultiplier;
 ball.vx=Math.cos(aimAngle)*strength;
 ball.vy=Math.sin(aimAngle)*strength;
 shooting=true;
 power=0;powerFill.style.width='0%';
}

function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);drawCourt();drawHoop();drawAim();drawBall();drawOverlay()}
function loop(){update();draw();requestAnimationFrame(loop)}
loop();
