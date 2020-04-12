
export class Abstract_Obstacle {

    //soll true zurückgeben, falls der Spieler mit dem Objekt zusammenstößt, sonst false
    collision(rect){}

    completly_shown() {}
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

export class Player extends Rect_Obstacle
{

}


export class Normal_Pipe extends Movable_Rect_Obstacle
{
    constructor(x, y, height, width, vx, dist_to_predecessor, hole_width)
    {
        super(x, y, width, height, vx, 0);
        this.dist_to_predecessor = dist_to_predecessor;
        this.hole_width = hole_width;

        this.hole_position = (Math.random() * 0.8 + 0.1) * height;

        this.upper_pipe = new Pipe_Part(x + dist_to_predecessor, y, this.hole_position - hole_width, vx, "upper", "green");
        this.lower_pipe = new Pipe_Part(x + dist_to_predecessor, y + this.hole_position + hole_width, y + height, vx, "lower", "green")
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
}

export class Pipe_Part extends Movable_Rect_Obstacle
{
    static gradient_map = new Map();
    static pipe_width = 80;

    constructor(x, y, height, vx, type, color)
    {
        super(x, y, Pipe_Part.pipe_width, height, vx, 0);

        this.type = type;
        this.color = color;
    }

    draw(ctx)
    {
        if(!Pipe_Part.gradient_map.has(this.color))
        {
            let grad = ctx.createLinearGradient(0, 0, Pipe_Part.pipe_width, 0);
            grad.addColorStop(0, this.color);
            grad.addColorStop(0.8, "white");
            grad.addColorStop(1, this.color);

            Pipe_Part.gradient_map.set(this.color, grad);
        }

        ctx.lineWidth = "4";
        ctx.fillStyle = Pipe_Part.gradient_map.get(this.color);
        ctx.rect(this.x, this.y, this.height, this.width);
    }
}