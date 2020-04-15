import {Movable_Rect_Obstacle} from "./Obstacle.js";

export class Generell_Pipe extends Movable_Rect_Obstacle
{
    constructor(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color, hole_position)
    {
        super(x, y, width, height, vx, vy);
        this.dist_to_predecessor = dist_to_predecessor;
        this.hole_width = hole_width;

        this.hole_position = hole_position || Math.floor((Math.random() * 0.4 + 0.3) * height);

        this.make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color, this.hole_position);
    }

    make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color)
    {
        this.upper_pipe = new Pipe_Part(x + dist_to_predecessor, y - 10, this.hole_position - hole_width, vx, "upper", upper_color);
        this.lower_pipe = new Pipe_Part(x + dist_to_predecessor, y + this.hole_position + hole_width, y + height, vx, "lower", lower_color)
    }

    update()
    {
        super.update();
        this.upper_pipe.update();
        this.lower_pipe.update();
    }

    draw(ctx)
    {
        this.upper_pipe.draw(ctx);
        this.lower_pipe.draw(ctx);
    }

    collision(rect)
    {
        return this.upper_pipe.collision(rect) || this.lower_pipe.collision(rect);
    }
}

//Klassische Rohre aus Flappy Birds
export class Normal_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "green", "green");
    }
}

//Rohre bewegen sich rauf und runter
export class Up_And_Down_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "blue", "blue");

        this.hole_position_change = (Math.random() * 2 - 1) * 70;
        this.hole_position_movement = 1.5;
    }

    update()
    {
        super.update();
        this.upper_pipe.height += this.hole_position_movement;
        this.lower_pipe.y += this.hole_position_movement;
        this.hole_position_change += this.hole_position_movement;

        if(Math.abs(this.hole_position_change) > 70)
        {
             this.hole_position_movement *= -1;
        }
    }

}

//Rohrpaare, die direkt verbunden sind und einen Gang bilden
export class Corridor_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "orange", "orange");
    }

    make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color, hole_position)
    { 
        this.corridor_pipes = [];

        for(let i = x + dist_to_predecessor; i < x + width; i += Pipe_Part.pipe_width)
        {
            this.corridor_pipes.push(new Generell_Pipe(i, y, Pipe_Part.pipe_width, height, vx, vy, 0, hole_width, upper_color, lower_color, hole_position));
        }
    }  

    update()
    {
        Movable_Rect_Obstacle.prototype.update.apply(this);
        this.corridor_pipes.forEach(pipe => pipe.update());
    }

    draw(ctx)
    {
        this.corridor_pipes.forEach(pipe => pipe.draw(ctx));
    }

    collision(rect)
    {
        for(let pipe of this.corridor_pipes)
        {
            if(pipe.collision(rect))
            {
                return true;
            }
        }

        return false;
    }
}

//Rohrpaar das sich einseitig zufällig schließt
export class Closing_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "red", "green", height/2);

        this.inactive_pipe = this.lower_pipe;
        if(Math.random() < .5)
        {
            this.swap_pipe_colors();
        }
    }

    update()
    {
        super.update();

        if(this.x > 170)
        {
            if(!(this.x%20))
            {
                this.swap_pipe_colors();
            }
        }
        else{
            if(this.inactive_pipe === this.upper_pipe)
            {
                this.lower_pipe.vy = -2;
            }
            else{
                this.upper_pipe.height += 2;
            }

        }
    }

    swap_pipe_colors()
    {
        console.log("switch");
        this.upper_pipe.color = this.upper_pipe.color === "red"? "green" : "red";
        this.lower_pipe.color = this.lower_pipe.color === "red"? "green" : "red";


        this.inactive_pipe = this.inactive_pipe == this.upper_pipe? this.lower_pipe : this.upper_pipe;
    }
}

export class Pipe_Part extends Movable_Rect_Obstacle
{
    static pipe_width = 100;

    constructor(x, y, height, vx, type, color)
    {
        super(x, y, Pipe_Part.pipe_width, height, vx, 0);

        this.type = type;
        this.color = color;
    }

    create_pipe_gradient(ctx, x, y, width)
    {
        let grad = ctx.createLinearGradient(x, y, width, y);

        grad.addColorStop(0.55, this.color);
        grad.addColorStop(0.8, "LightGray");
        grad.addColorStop(1, this.color)

        return grad;
    }

    draw(ctx)
    {
        let main_pipe_y = this.type === "upper" ? this.y : this.y + 40;

        ctx.lineWidth = "2";
        ctx.fillStyle = this.create_pipe_gradient(ctx, this.x + 10, main_pipe_y, this.x + Pipe_Part.pipe_width - 10);
        ctx.fillRect(this.x + 10, main_pipe_y, this.width - 20, this.height - 40);
        //ctx.beginPath()
        ctx.rect(this.x + 10, main_pipe_y, this.width - 20, this.height - 40);
        //ctx.stroke();


        let pipe_end_y = this.type === "upper" ?  this.y + this.height - 40: this.y; 

        ctx.fillStyle = this.create_pipe_gradient(ctx, this.x, pipe_end_y, this.x + Pipe_Part.pipe_width);
        ctx.fillRect(this.x, pipe_end_y, Pipe_Part.pipe_width, 40);
        ctx.rect(this.x, pipe_end_y, Pipe_Part.pipe_width, 40);

        //Hitbox anzeige
        //ctx.rect(this.x, this.y, this.width, this.height);
        
    }
}