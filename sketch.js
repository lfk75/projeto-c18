//Criar variáveis
var trex, trexRun;
var solo, imgSolo;
var soloInvisivel;
var imgNuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var grupoObstaculos, grupoNuvens;
var trexM;
var over, overimg;
var retry, retryimg;
var somJump;
var somCheckpoint;
var somPerdeu;

//Definir pontuação do jogo
var score = 0;

//Estado de Jogo
const PLAY = 1;
const END = 0;

var gameState = PLAY;

function preload(){

  //Adicionar animação do T-Rex Correndo
  trexRun = loadAnimation("trex1.png", "trex2.png","trex3.png" );
 
  trexM = loadAnimation("trex_collided.png");
  //Carregar imagens
  imgSolo = loadImage("ground2.png");
  imgNuvem = loadImage("cloud2.png");

  //imagens de game over
  overimg = loadImage("gameOver.png");
  retryimg = loadImage("restart.png");

  somJump = loadSound("jump.mp3");
  somCheckpoint = loadSound("checkPoint.mp3");
  somPerdeu = loadSound("die.mp3");

  //Imagens dos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

}

function setup(){
  createCanvas(windowWidth,windowHeight);

  //Definir grupos
  grupoNuvens = new Group();
  grupoObstaculos = new Group();
  

  //criar tela de game over
  over = createSprite(width*0.5,height*0.6);
  over.addImage("over", overimg);
  over.scale = 0.6;
  over.visible = false

  retry = createSprite(width*0.5,height*0.65);
  retry.addImage("tente", retryimg);
  retry.scale = 0.45;
  retry.visible = false

  //crie um sprite de trex
  trex = createSprite(width*0.1,height*0.74,width*0.5,height*0.15);
  trex.addAnimation("correndo", trexRun);
  trex.addAnimation("morto", trexM);
  trex.scale = 0.6;

  trex.setCollider("rectangle",0,0, 100,70);
  trex.debug = false

  //Criar sprite do solo
  solo = createSprite(width*0.5,height*0.75,width*0.99,height*0.03);
  solo.addImage("solo",imgSolo);

  //Criar Sprite do Solo Invisível
  soloInvisivel = createSprite(200,height*0.76,width*0.99,height*0.03);
  soloInvisivel.visible = false;
      
  
 
  
  
}
 
function draw(){

  //Definir fundo e limpar a tela
  background("white")

  //Marcar pontuação do Jogo
  text("Pontuação: " + score, width*0.1,height*0.4);


  //Definir o comportamento dos objetos em cada estado do jogo
  if(gameState === PLAY){

    //Atualização da pontuação
    score = score + Math.round(frameRate()/60);
   console.log(frameRate())
    //Fazer o T-Rex saltar na tela
    if(keyDown("space") && trex.isTouching(solo)  || touches.lenght > 0){
      trex.velocityY = -12;
      somJump.play();

    touches = []
    }

   if (score % 1000 === 0 && score > 0) {
   somCheckpoint.play();
   }


   //gravidade
    trex.velocityY = trex.velocityY + 0.5;

    //Atribuir velocidade ao T-Rex a partir do movimento do solo
    solo.velocityX = -(3 +score/1000);

      //Reiniciar posição do solo
    if(solo.x < 0){
      solo.x = width/2;
    }

  //Gerar nuvens
  gerarNuvens();

  //Gerar obstáculos do solo
  gerarObstaculos();

  if(grupoObstaculos.isTouching(trex)){
    gameState = END;
    somPerdeu.play();
  }

  }
  else if(gameState === END){
    //Atribuir velocidade ao T-Rex a partir do movimento do solo
    solo.velocityX = 0;
  
    over.visible = true;
    retry.visible = true;

    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    trex.changeAnimation("morto")

    //gravidade zero
    trex.velocityY = 0


   if (mousePressedOver(retry) || touches.lenght > 0) {
  reset();

   } 
  }

  //Fazer o Trex colidir com o solo
  trex.collide(soloInvisivel);

  //Desenhar sprites na tela
  drawSprites();

}
function gerarNuvens(){
  //Escrever aqui o código para gerar as nuvens
  if(frameCount % 60 === 0){
    var nuvem = createSprite(width*0.99,height*0.70,width*0.5,height*0.15);
    nuvem.velocityX = -(3 +score/1000);
    
    //Adicionar imagem da nuvem nos sprites
    nuvem.addImage(imgNuvem);
    nuvem.scale = Math.round(random(4,6))/10;
    
    //Tornar posição Y da nuvem aleatória
    nuvem.y = Math.round(random(height*0.6,height*0.5));
    
    //Garantir que profundidade da nuvem seja maior que a do T-Rex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    
    nuvem.lifetime = 380
    //Adicionar nuvem criada ao grupo de nuvens
    grupoNuvens.add(nuvem);
   
    
  } 
}
function gerarObstaculos(){
  if(frameCount % 60 === 0){
    var obstaculo = createSprite(width*0.99,height*0.74,5,width*0.5,height*0.15);
    obstaculo.velocityX = -(5 +score/1000);
    
    //Criar Obstáculos aleatórios
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
              default: break;
    }
    
    // Alterar escala e vida útil
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 270

    //Adicionar nuvem criada ao grupo de nuvens
    grupoObstaculos.add(obstaculo);
    
  }
}

function reset() {
gameState = PLAY;
score = 0;
trex.changeAnimation("correndo");
grupoNuvens.destroyEach();
grupoObstaculos.destroyEach();
over.visible = false;
retry.visible = false;

}
