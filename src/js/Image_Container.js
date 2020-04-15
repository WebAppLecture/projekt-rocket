export class Image_Container
{
    constructor(x, y, img_src)
    {
        this.x = x;
        this.y = y;

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
    }

    draw(ctx)
    {
        if(!this.loaded) return;

        ctx.drawImage(this.img, this.x, this.y);
        if(this.x + this.width < this.screen_width)
        {
            ctx.drawImage(this.img, this.x + this.width, this.y);
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
}