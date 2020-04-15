import { allOf } from "./MulitInheritance.js";
import { Image_Container, Container } from "./Container.js";

export class Abstract_Obstacle extends Container {

    //soll true zurückgeben, falls der Spieler mit dem Objekt zusammenstößt, sonst false
    collision(rect){}

    completly_shown() {}

    out_of_screen(){}
}

export class Rect_Obstacle extends Abstract_Obstacle
{
    constructor(x, y, width, height)
    {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    collision(rect)
    {
        return rect.x < this.x + this.width &&
        rect.x + rect.width > this.x &&
        rect.y < this.y + this.height &&
        rect.y + rect.height > this.y;
    }

    completly_shown(canvas_width)
    {
        return this.x + this.width < canvas_width;
    }

    out_of_screen()
    {
        return this.x + this.width < 0;
    }

    change_position(x, y, width, height)
    {
        super.change_position(x, y);
        this.width = width || this.width;
        this.height = height || this.height;
    }

    draw(){}
}

//Klasse für Hindernisse, die sich mit konstanter Geschwindigkeit bewegen
export class Movable_Rect_Obstacle extends Rect_Obstacle
{

    constructor(x, y, width, height, vx, vy)
    {
        super(x, y, width, height);
        this.vx = vx;
        this.vy = vy;
    }

    update()
    {
        this.change_position(this.x + this.vx, this.y + this.vy);
    }

    draw() {}
}

export class Player extends Movable_Rect_Obstacle
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height, 0, 0);

        this.load_player_sprites();
        this.rotation = 0;
    }

    load_player_sprites()
    {
        this.player_sprites = [];
        this.player_sprites.push(new Image_Container(this.x, this.y, "#birdmid"));
        this.player_sprites.push(new Image_Container(this.x, this.y, "#birdup"));
        this.player_sprites.push(this.player_sprites[0]);
        this.player_sprites.push(new Image_Container(this.x, this.y, "#birddown"));

        this.sprite_counter = 0;
    }

    update()
    {
        super.update();
        this.vy += .7;

        this.rotation = Math.max(Math.atan((this.vy - 12) / 3), -Math.PI / 8);
        if(this.y < 0) this.y = 0;
    }

    draw(ctx)
    {
        let akt_img = this.player_sprites[Math.floor(this.sprite_counter/4)];
        akt_img.change_position(this.x, this.y);
        akt_img.draw(ctx, this.rotation);
        this.sprite_counter = (this.sprite_counter + 1)%16;

        ctx.rect(this.x, this.y, this.width, this.height);
    }

    jump()
    {
        this.vy = -11;
    }

}