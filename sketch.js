var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score ;
  var  highScore = 0, copyScore = 0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var back,backImage;
var sun,sunImage;


function preload(){
  trex_running = loadImage("trex.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("clod-1.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
 
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  
  backImage=loadImage("back.jpeg");
  
  sunImage = loadImage("sun.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 //console.log(message)
  
 back = createSprite(300,100);
  back.addImage(backImage);
  back.scale = 1.2;
  
  trex = createSprite(50,160,20,50);
  trex.addImage("running", trex_running);
 
  

  trex.scale = 0.1;
  
  ground = createSprite(200,425,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 1;
  
  gameOver = createSprite(300,80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,180);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,195,400,10);
  invisibleGround.visible = false;
  
   sun = createSprite(550,30);
  sun.addImage(sunImage);
  sun.scale = 0.1
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0);
  trex.debug =false;
  

  
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    copyScore = score + Math.round(getFrameRate()/60);
   
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 150) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
    
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
     if(mousePressedOver(restart)) {
      reset();
    }
    if(score>highScore){
       highScore = copyScore;
     }
     
    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  

 console.log(trex.y);
   
  
  drawSprites();
  text(mouseX+"."+mouseY+mouseX+mouseY);
  
  fill("black");
    textSize(20);
  textFont("Times New Roman");
  text("Score: "+ score, 400,20);
  text("HighScore: "+ highScore,250,20);
}

function reset(){
   gameState = PLAY;
   restart.visible = false;
   gameOver.visible = false;
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
   trex.changeAnimation("running",trex_running);
   score = 0;
  


}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
  obstacle.addImage(obstacle1);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.09;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

