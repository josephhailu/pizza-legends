class Overworld{
    constructor(config){
        this.element = config.element
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    /**
     * Draw to the canvas
     * 
     * create a new image, assigna  source to that image
     * when that image is downloaded, we copy the info to the canvas
     * 
     * the image is scaled via css
     */
    init(){
        const image = new Image();
        image.onload = () =>{
            this.ctx.drawImage(image,0,0)
        };
        image.src = "/images/maps/DemoLower.png"

        let x = 5
        let y = 6

        const shadow = new Image();
        shadow.onload = () =>{
            this.ctx.drawImage(
                shadow,
                0, // starting crop point for left
                0, // starting crop point for top
                32,// width of crop to make
                32, // height of crop to make
                x*16-7, // x position
                y*16-18,// y position
                32, // image width (based on character size)
                32 // image height (based on character size)
                )
        };
        shadow.src = "/images/characters/shadow.png"


        const hero =  new Image();
        hero.onload = () =>{
            this.ctx.drawImage(
                hero,
                0, // starting crop point for left
                0, // starting crop point for top
                32,// width of crop to make
                32, // height of crop to make
                x*16-7, // x position
                y*16-18,// y position
                32, // image width (based on character size)
                32 // image height (based on character size)
                )
        };
        hero.src = "/images/characters/people/hero.png";
    }
}