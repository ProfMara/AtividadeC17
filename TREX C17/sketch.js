var JOGAR = 1;
var FIM = 0;
var gameState = JOGAR;




var trex, trex_running, trex_collided;
var solo, soloInvisivel, soloIMG;

var grupoNuvem, nuvemImg;
var grupoObs, obs1, obs2, obse3, obs4, obs5, obs6;

var ponto = 0;
var gameOverImg, restartImg
var somPulo, somCheckPoint, somMorte;

function preload() {
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadAnimation("trex_collided.png");

    soloIMG = loadImage("ground2.png");

    nuvemImg = loadImage("cloud.png");

    obs1 = loadImage("obstacle1.png");
    obs2 = loadImage("obstacle2.png");
    obs3 = loadImage("obstacle3.png");
    obs4 = loadImage("obstacle4.png");
    obs5 = loadImage("obstacle5.png");
    obs6 = loadImage("obstacle6.png");

    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")

    somPulo = loadSound("jump.mp3")
    somMorte = loadSound("die.mp3")
    somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
    createCanvas(600, 200);


    trex = createSprite(50, 180, 20, 50);

    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);


    trex.scale = 0.5;

    solo = createSprite(200, 180, 400, 20);
    solo.addImage("ground", soloIMG);
    solo.x = solo.width / 2;

    gameOver = createSprite(300, 100);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300, 140);
    restart.addImage(restartImg);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    soloInvisivel = createSprite(200, 190, 400, 10);
    soloInvisivel.visible = false;

    //criar Grupos de Obstáculos e Nuvens
    grupoObs = createGroup();
    grupoNuvem = createGroup();


    trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
    trex.debug = true

}

function draw() {

    background(180);
    //exibir pontuação
    text("Pontuação: " + ponto, 500, 50);


    if (gameState === JOGAR) {
        //mover o 
        gameOver.visible = false;
        restart.visible = false;
        //mudar a animação do trex
        trex.changeAnimation("running", trex_running);

        solo.velocityX = -(4 + 3 * ponto / 100)
            //pontuação
        ponto = ponto + Math.round(frameCount / 60);

        if (ponto > 0 && ponto % 100 === 0) {
            somCheckPoint.play()
        }

        if (solo.x < 0) {
            solo.x = solo.width / 2;
        }

        //pular quando a barra de espaço é pressionada
        if (keyDown("space") && trex.y >= 120) {
            trex.velocityY = -12;
            somPulo.play();
        }

        //acrescentar gravidade
        trex.velocityY = trex.velocityY + 0.8

        //gerar as nuvens
        gerarNuvem();

        //gerar obstáculos no chão
        gerarObs();

        if (grupoObs.isTouching(trex)) {
            //trex.velocityY = -12;

            gameState = FIM;
            somMorte.play()

        }



    } else if (gameState === FIM) {
        gameOver.visible = true;
        restart.visible = true;
        //mudar a animação do trex
        trex.changeAnimation("collided", trex_collided);


        if (mousePressedOver(restart)) {
            reset();
        }

        solo.velocityX = 0;
        trex.velocityY = 0


        //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
        grupoObs.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);

        grupoObs.setVelocityXEach(0);
        grupoNuvem.setVelocityXEach(0);

    }


    //impedir que trex caia
    trex.collide(soloInvisivel);


    drawSprites();
}




function gerarObs() {
    if (frameCount % 60 === 0) {
        var obs = createSprite(600, 165, 10, 40);
        obs.velocityX = solo.velocityX;

        //gerar obstáculos aleatórios
        var aleatorio = Math.round(random(1, 6));
        switch (aleatorio) {
            case 1:
                obs.addImage(obs1);
                break;
            case 2:
                obs.addImage(obs2);
                break;
            case 3:
                obs.addImage(obs3);
                break;
            case 4:
                obs.addImage(obs4);
                break;
            case 5:
                obs.addImage(obs5);
                break;
            case 6:
                obs.addImage(obs6);
                break;
            default:
                break;
        }

        //atribuir escala e tempo de vida ao obstáculo           
        obs.scale = 0.5;
        obs.lifetime = 300;

        //acrescentar cada obstáculo ao grupo
        grupoObs.add(obs);
    }
}

function gerarNuvem() {
    //escreva o código aqui para gerar as nuvens
    if (frameCount % 60 === 0) {
        var nuvem = createSprite(600, 120, 40, 10);
        nuvem.y = Math.round(random(80, 120));
        nuvem.addImage(nuvemImg);
        nuvem.scale = 0.5;
        nuvem.velocityX = -3;

        //atribuir o tempo de vida da variável
        nuvem.lifetime = 200;

        //ajuste a profundidade
        nuvem.depth = trex.depth;
        trex.depth = trex.depth + 1;

        //acrescente cada nuvem ao grupo
        grupoNuvem.add(nuvem);
    }
}


function reset() {


}