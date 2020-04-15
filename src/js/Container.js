
//Oberklasse für alle Klassen, deren Objekte  x/y - Koordinaten
//auf der Canvas haben und die gezeichnet werden sollen
export class Container{
    constructor(x, y)
    {
        this.change_position(x, y);
    }

    change_position(x, y)
    {
        this.x = x;
        this.y = y;
    }
    
    draw(ctx){}
}

export class Image_Container extends Container
{
    constructor(x, y, img_src)
    {
        super(x, y);
        this.load_image(img_src);
    }

    load_image(img_src)
    {
        this.img = document.querySelector(img_src);
        if(this.img === undefined || !this.img.complete || this.img.naturalWidth === 0)
        {
            console.log("Hintergrund konnte nicht geladen werden!");
            this.loaded = false;
            return;
        }
        this.loaded = true;
        this.width = this.img.width;
        this.height = this.img.height;
        
        this.center_x = this.x + this.width/2;
        this.center_y = this.y + this.img.height/2;
    }

    draw(ctx, rotation)
    {
        if(!this.loaded) return;

        if(!rotation)
        {
            ctx.drawImage(this.img, this.x, this.y);
        }
        else{
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(rotation);
            ctx.drawImage(this.img, -this.width/2, -this.height/2);
            //ctx.rect(0, 0, this.width, this.height);
            ctx.rotate(-rotation);
            ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
            //ctx.rect(this.x, this.y, this.width, this.height);
        }
    }

    change_position(x, y)
    {
        super.change_position(x, y);
        if(this.width && this.height)
        {
            this.center_x = this.x + this.width/2;
            this.center_y = this.y + this.height/2;
        }
    }
}

export class Background_Image_Handler extends Image_Container
{
    constructor(x, y, screen_width, screen_height)
    {
        super(x, y, "#backgroundimage");
        this.screen_width = screen_width;
        this.screen_height = screen_height;
    }

    update()
    {
        this.x -= .5;
        if(this.x + this.width < 0)
        {
            this.x = 0;
        }
    }

    draw(ctx)
    {
        super.draw(ctx);
        if(this.loaded && this.x + this.width < this.screen_width)
        {
            ctx.drawImage(this.img, this.x + this.width, this.y);
        } 
    }
}


export class TextContainer extends Container
{
    constructor(x, y, text, font)
    {
        super(x, y);
        this.text = text;
        this.font = font;
    }

    draw(ctx)
    {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }
}