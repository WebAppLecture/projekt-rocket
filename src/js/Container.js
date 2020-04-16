
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
    constructor(x, y, width, height, text, font, font_color, background)
    {
        super(x, y);
        this.height = height;
        this.width = width;
        this.text = text;
        this.font = font;
        this.font_color = font_color;
        this.background = background
    }

    draw(ctx)
    {
        if(this.background)
        {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.fillStyle = this.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }

        ctx.fillStyle = this.font_color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.font;
        ctx.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
    }
}

export class GameOverScreen extends Container
{
    constructor(x, y, width, height)
    {
        super(x, y);
        this.change_position(x, y, width, height);
        this.setup_screen();
    }
    
    change_position(x, y, width, height)
    {
        super.change_position(x, y);
        this.width = width || this.width;
        this.height = height || this.height;
    }

    setup_screen()
    {
        this.gameOverScreen_elements = [];

        this.gameOverScreen_elements.push(new TextContainer(this.x, this.y, this.width, this.height/3, "Game Over", "35px Impact", "white"));
        this.gameOverScreen_elements.push(new TextContainer(this.x, this.y + this.height/3, this.width/2, this.height/3, "Score:", "25px Impact", "white"));
        this.gameOverScreen_elements.push(new TextContainer(this.x + this.width/2, this.y + this.height/3, this.width/2, this.height/3, 0, "25px Impact", "white"));
        this.gameOverScreen_elements.push(new TextContainer(this.x, this.y + 2 * this.height/3, this.width/2, this.height/3, "Highscore:", "25px Impact", "white"));
        this.gameOverScreen_elements.push(new TextContainer(this.x + this.width/2, this.y + 2 * this.height/3, this.width/2, this.height/3, 0, "25px Impact", "white"));

        this.gameOverScreen_elements.push(new TextContainer(this.x + this.width/2 - 300, this.y + this.height + 100, 600, 45,
                                        "Drücke die Leertaste für einen neuen Versuch!", "25px Impact", "LightGray", "#FF6100"));
    }

    update(score)
    {
        score *= 1;

        if(score > this.gameOverScreen_elements[4].text)
        {
            this.gameOverScreen_elements[4].text = score;
        }

        this.gameOverScreen_elements[2].text = score;
    }   

    draw(ctx)
    {
        ctx.beginPath();
        ctx.lineWidth = "10";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "#FF6100";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.gameOverScreen_elements.forEach(elem => elem.draw(ctx));
    }
}