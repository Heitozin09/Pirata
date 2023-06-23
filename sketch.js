const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world;
var backgroundImg
var tower
var towerImg
var cannon 
var angle = 20
var cannonball
var balls=[]
var boats=[]
var boatAnimation=[]
var boatSpriteData
var boatSpriteSheet
var brokeBoatAnimation=[]
var brokeBoatSpriteData
var borkeBoatSpriteSheet
var waterAnimation=[]
var waterSpriteData
var waterSpriteSheet
var waterSound
var cannonSound
var pirateSound
var backgroundSound
var isGameOver = false
var isLaughing=false
var score = 0

function preload() {
  backgroundImg = loadImage("./assets/background.gif")
  towerImg = loadImage("./assets/tower.png")

  boatSpriteData = loadJSON("./assets/boat/boat.json")
  boatSpriteSheet = loadImage("./assets/boat/boat.png")

  brokeBoatSpriteData = loadJSON("./assets/boat/broken_boat.json")
  brokeBoatSpriteSheet = loadImage("./assets/boat/broken_boat.png")

  waterSpriteData=loadJSON("./assets/water_splash/water_splash.json")
  waterSpriteSheet=loadImage("./assets/water_splash/water_splash.png")

  waterSound=loadSound("./assets/cannon_water.mp3")
  pirateSound=loadSound("./assets/pirate_laugh.mp3")
  cannonSound=loadSound("./assets/cannon_explosion.mp3")
  backgroundSound=loadSound("./assets/background_music.mp3")

}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160,350,160, 310, options);
  World.add(world,tower);

  angleMode(DEGREES)
  angle = 15
  cannon = new Cannon(180,110,130,100,angle)

  var boatFrames=boatSpriteData.frames
  for (let i = 0; i < boatFrames.length; i++) {
    var pos=boatFrames[i].position
    var Img=boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    boatAnimation.push(Img)

  }

  var brokenBoatFrames = brokeBoatSpriteData.frames
  for (let i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position
    var img = brokeBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    brokeBoatAnimation.push(img)

  }

  var waterFrames=waterSpriteData.frames
  for (let i = 0; i < waterFrames.length; i++) {
    var pos=waterFrames[i].position
    var img = waterSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    waterAnimation.push(img)
  }


}
 

function draw() {

 background("darkblue")

  image(backgroundImg,0,0,1200,600)

  if (!backgroundSound.isPlaying()) {
    backgroundSound.play()
    backgroundSound.setVolume(0.1)
  }

  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  
  push()
  imageMode(CENTER)
  image(towerImg,tower.position.x, tower.position.y,160,310)
  pop()

  cannon.display()

  showBoats()

  fill ("black")
  textSize(40)
  text(`Pontuação:${score}`,width-300,50)
  
  for (let i = 0; i < balls.length; i++) {
  showCannonBalls(balls[i],i)
    collisionWithBoat(i)
  }
}

function keyReleased(){
  if(keyCode==DOWN_ARROW){
    cannonSound.play()
    cannonSound.setVolume(0.08)
    balls[balls.length-1].shoot()
  }
}

  function keyPressed(){
    if (keyCode==DOWN_ARROW) {
      
     var cannonball = new CannonBall(cannon.x,cannon.y)
     balls.push(cannonball)
    }
  }

  function showCannonBalls(ball,index){
    if (ball) {
      ball.display()
      ball.animate()
      if (ball.body.position.x>=width||
        ball.body.position.y>=height-50) {
          if (!waterSound.isPlaying()) {
            waterSound.play()
             waterSound.setVolume(0.5)
          }
        ball.remove(index)
      }
    }
  }

  function showBoats(){
    if (boats.length>0) {
      if(boats[boats.length-1]===undefined ||
        boats[boats.length-1].body.position.x<width-300){
          var positions = [-40,-60,-70,-20]
          var position = random(positions)
          var boat=new Boat(width-79,height-60,170,170,position,boatAnimation)
       boats.push(boat)
        }
      for (let i = 0; i < boats.length; i++) {
        if (boats[i]) {
          Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0})
          boats[i].display()
          boats[i].Animate()
          var collision=Matter.SAT.collides(this.tower,boats[i].body)
          if (collision.collided&& !boats[i].isBroken) {
            if (!isLaughing&&!pirateSound.isPlaying()) {
              pirateSound.play()
              isLaughing=true

            }
            isGameOver = true
            GameOver()
          }

        }
      }
    } else {
      var boat=new Boat(width-79,height-60,170,170,-80,boatAnimation)
      boats.push(boat)
  
    }

  }

    function collisionWithBoat(index){
      for (let i = 0; i < boats.length; i++) {
        if (balls[index]!==undefined&&boats[i]!==undefined) {
          var collision = Matter.SAT.collides(balls[index].body,boats[i].body)
          if (collision.collided) {
            score+=10
            boats[i].remove(i)

            Matter.World.remove(world,balls[index].body)
            delete balls[index]
          }
        }
      }
    }

    function GameOver(){
      swal ({
        title:"Fim de Jogo",
        text:"Obrigado por jogar",
        imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize:"150x150",
        confirmButtonText:"Reiniciar",
      },
      function(isConfirm){
        if (isConfirm) {
          location.reload()
        }
      })
    }