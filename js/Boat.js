class Boat{
    constructor(x,y,w,h,boatpos,boatAnimation){
       var option = {isStatic:false}
       this.w = w
       this.h = h
       this.boatpos = boatpos
       this.boatAnimation=boatAnimation
       this.speed=0.05
       this.isBroken=false
       this.img = loadImage("./assets/boat.png")
       this.body = Bodies.rectangle(x,y,w,h,option)
       World.add(world,this.body)
    }

    Animate(){
        this.speed+=0.05

    }

    remove(index){

        this.boatAnimation=brokeBoatAnimation
        this.speed=0.05
        this.w=300
        this.h=300
        this.isBroken=true
        setTimeout(() => {
            Matter.World.remove(world,boats[index].body)
            delete boats[index]
        }, 2000);
    }

    display(){
        var pos=this.body.position
        var angle=this.body.angle
        var index=floor(this.speed%this.boatAnimation.length)
        push()
        translate(pos.x,pos.y)
        rotate(angle)
        imageMode(CENTER)
        image (this.boatAnimation[index],0,this.boatpos,this.w,this.h)
        pop()


    }
}





