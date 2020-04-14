
export class Abstract_Obstacle {

    //soll true zurückgeben, falls der Spieler mit dem Objekt zusammenstößt, sonst false
    collision(rect){}

    completly_shown() {}

    out_of_screen(){}
}

export class Rect_Obstacle extends Abstract_Obstacle
{
    constructor(x, y, width, height)
    {
        super();
        this.x = x;
        this.y = y;
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
        this.x = x;
        this.y = y;
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
    }

    update()
    {
        super.update();
        this.vy += .7;

        if(this.y < 0) this.y = 0;
    }

    draw(ctx)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump()
    {
        this.vy = -10;
    }

}

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

//Zwei Rohrpaare, die verbunden sind, sodass der Spieler 
//eine zeitlang in der Bewegung eingeschränkt ist
/*export class Corridor_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "orange", "orange");
    }

    make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color)
    {
        super.make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color);
        this.generate_corridor(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color);
    }

    generate_corridor(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color)
    {
        this.corridor_end_upper_pipe = new Pipe_Part(x + width - Pipe_Part.pipe_width, y - 10, this.hole_position - hole_width, vx, "upper", upper_color);
        this.corridor_end_lower_pipe = new Pipe_Part(x + width - Pipe_Part.pipe_width, y + this.hole_position + hole_width, y + height, vx, "lower", lower_color);

        this.corridor_upper_wall = new Movable_Rect_Obstacle(x + dist_to_predecessor + Pipe_Part.pipe_width - 10,
                                                            this.hole_position - hole_width - 40 - Pipe_Part.pipe_width,
                                                            width - dist_to_predecessor - 2*Pipe_Part.pipe_width + 20,
                                                            Pipe_Part.pipe_width - 20,
                                                            vx, vy);
        this.corridor_lower_wall = new Movable_Rect_Obstacle(x + dist_to_predecessor + Pipe_Part.pipe_width - 10,
                                                            this.hole_position + hole_width + 50,
                                                            width - dist_to_predecessor - 2*Pipe_Part.pipe_width + 20,
                                                            Pipe_Part.pipe_width - 20,
                                                            vx, vy);
    }

    update()
    {
        super.update();
        this.corridor_end_upper_pipe.update();
        this.corridor_end_lower_pipe.update();

        this.corridor_lower_wall.update();
        this.corridor_upper_wall.update();
    }

    draw(ctx)
    {
        super.draw(ctx);
        this.corridor_end_upper_pipe.draw(ctx);
        this.corridor_end_lower_pipe.draw(ctx);

        this.draw_corridor_wall(ctx, this.corridor_upper_wall);
        this.draw_corridor_wall(ctx, this.corridor_lower_wall);
    }

    draw_corridor_wall(ctx, wall)
    {
        ctx.fillStyle = this.make_wall_gradient(ctx, wall.x, wall.y, wall.y + wall.height);
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        ctx.rect(wall.x, wall.y, wall.width, wall.height);
    }

    make_wall_gradient(ctx, x, y, height)
    {
        let grad = ctx.createLinearGradient(x, y, x, height);

        grad.addColorStop(0, "orange");
        grad.addColorStop(.2, "LightGray");
        grad.addColorStop(1, "orange");

        return grad;
    }

    collision(rect)
    {
        return super.collision(rect) || this.corridor_collision(rect);
    }

    corridor_collision(rect)
    {
        return (this.corridor_end_lower_pipe.collision(rect) 
                || this.corridor_end_upper_pipe.collision(rect)
                || this.corridor_lower_wall.collision(rect)
                || this.corridor_upper_wall.collision(rect));
    }
}*/

export class Corridor_Pipe extends Generell_Pipe
{
    constructor(x, y, width, height, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0, dist_to_predecessor, hole_width, "orange", "orange");
    }

    make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color, hole_position)
    {
        super.make_upper_and_lower_pipe(x, y, width, height, vx, vy, dist_to_predecessor, hole_width, upper_color, lower_color);
        
        this.corridor_pipes = [];

        for(let i = x + dist_to_predecessor + Pipe_Part.pipe_width; i < x + width; i  += Pipe_Part.pipe_width)
        {
            this.corridor_pipes.push(new Generell_Pipe(i, y, Pipe_Part.pipe_width, height, vx, vy, 0, hole_width, upper_color, lower_color, hole_position));
        }
    }  

    update()
    {
        super.update();
        this.corridor_pipes.forEach(pipe => pipe.update());
    }

    draw(ctx)
    {
        super.draw(ctx);
        this.corridor_pipes.forEach(pipe => pipe.draw(ctx));
    }

    collision(rect)
    {
        if(super.collision(rect)) return true;

        for(let pipe of this.corridor_pipes)
        {
            if(pipe.collision(rect)) return true;
        }

        return false;
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