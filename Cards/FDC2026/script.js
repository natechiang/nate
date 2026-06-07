const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const powerFill=document.getElementById('powerFill');
const retryBtn=document.getElementById('retry');
const message=document.getElementById('message');

function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();window.addEventListener('resize',resize);

let ball,hoop,score=0;
let aiming=false,shooting=false,charging=false;
let aimAngle=-Math.PI/3;
let power=0;

const gravity=0.35;
const powerMultiplier=0.28;
const friction=0.998;

function reset(){
  const g=canvas.height/2;
  ball={x:canvas.width/2-250,y:canvas.height-130,r:12,vx:0,vy:0};
  hoop={x:canvas.width/2+120,y:g-180,w:70,h:6};
  aiming=false;shooting=false;charging=false;
  power=0;
  powerFill.style.width='0%';
  retryBtn.style.display='none';
}
reset();

function drawCourt(){
  let g=canvas.height/2;
  ctx.fillStyle="#d8b07a";
  ctx.fillRect(0,g,canvas.width,canvas.height-g);
}

function drawHoop(){
  ctx.fillStyle="#fb923c";
  ctx.fillRect(hoop.x,hoop.y,hoop.w,hoop.h);
  ctx.fillStyle="#e5e7eb";
  ctx.fillRect(hoop.x+hoop.w,hoop.y-90,8,90);
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
  ctx.fillStyle="#F57C00";
  ctx.fill();
}

function drawAim(){
  if(!aiming||shooting) return;
  let len=120;
  ctx.beginPath();
  ctx.moveTo(ball.x,ball.y);
  ctx.lineTo(ball.x+Math.cos(aimAngle)*len,ball.y+Math.sin(aimAngle)*len);
  ctx.strokeStyle="#7a9e7e";
  ctx.lineWidth=3;
  ctx.stroke();
}

function checkBackboardCollision(){
  // Backboard: x from hoop.x+hoop.w to hoop.x+hoop.w+8, y from hoop.y-90 to hoop.y
  const bx = hoop.x + hoop.w;
  const bw = 8;
  const by = hoop.y - 90;
  const bh = 90;

  const nearX = ball.x + ball.r > bx && ball.x - ball.r < bx + bw;
  const nearY = ball.y + ball.r > by && ball.y - ball.r < by + bh;

  if(nearX && nearY){
    // Determine which side the ball hit
    const overlapLeft  = (ball.x + ball.r) - bx;
    const overlapRight = (bx + bw) - (ball.x - ball.r);

    if(overlapLeft < overlapRight){
      // Hit the left face of the backboard
      ball.x = bx - ball.r;
    } else {
      // Hit the right face
      ball.x = bx + bw + ball.r;
    }
    ball.vx *= -0.5; // bounce with some energy loss
  }
}

function update(){
  if(charging){
    power=Math.min(100,power+1.5);
    powerFill.style.width=power+'%';
  }

  if(!shooting) return;

  ball.x+=ball.vx;
  ball.y+=ball.vy;
  ball.vy+=gravity;
  ball.vx*=friction;

  checkBackboardCollision();

  // ✅ SCORE
  if(ball.y > hoop.y && ball.y < hoop.y+20 &&
     ball.x > hoop.x && ball.x < hoop.x+hoop.w && ball.vy>0){
    score++;
    document.getElementById('score').innerText=score;

    // ✅ SHOW MESSAGE
    message.style.display='block';
    setTimeout(()=>message.style.display='none',1500);

    reset();
  }

  if(ball.y > canvas.height){
    shooting=false;
    retryBtn.style.display='block';
  }
}

retryBtn.onclick = reset;

canvas.addEventListener('mousemove',e=>{
  if(aiming){
    let dx=e.clientX-ball.x;
    let dy=e.clientY-ball.y;
    aimAngle=Math.atan2(dy,dx);
    if(aimAngle > -0.2) aimAngle = -0.2;
  }
});

canvas.addEventListener('mousedown',()=>{aiming=true;charging=true});
canvas.addEventListener('mouseup',()=>{
  if(!aiming)return;
  aiming=false;charging=false;
  let strength=power*powerMultiplier;
  ball.vx=Math.cos(aimAngle)*strength;
  ball.vy=Math.sin(aimAngle)*strength;
  shooting=true;
  power=0;
  powerFill.style.width='0%';
});

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCourt();
  drawHoop();
  drawAim();
  drawBall();
}

function loop(){update();draw();requestAnimationFrame(loop)}
loop();
