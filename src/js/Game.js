import {Normal_Pipe, Player, Up_And_Down_Pipe} from "./Obstacle.js"

export class Game
{
    constructor(screen)
    {
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");

        this.width = screen.width;
        this.height = screen.height;

        this.gameOver = true;
        this.player = new Player(200, this.screen.height + 10, 0, 0);

        //this.setup_controls();
    }

    setup_controls()
    {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    onKeyDown(event)
    {
        //console.log("Eingabe registriert: \"" + event.key + "\"!");

        console.log(this.player.y + " " + this.screen.height + " " + this.gameOver);

        if(event.key === " " || event.key === "Spacebar")
        {
            if(this.gameOver)
            {
                if(this.player.y > this.screen.height) this.start_game();
            }
            else{
                this.player.jump();
            }
        }
    }

    start_game()
    {   
        this.obstacles = [];
        this.obstacle_selector = new Obstacle_Selector(this.screen.width, this.screen.height);

        this.player = new Player(200, 300, 70, 70);
        this.gameOver = false;

        this.gameloop();

    }

    gameloop()
    {
        if(this.player.y < this.screen.height)
        {
            requestAnimationFrame(this.gameloop.bind(this));
            this.update_obstacles();
            this.draw_obstacles();  
            this.gameOver = this.check_gameOver() || this.gameOver;
        }
    }

    update_obstacles()
    {
        this.player.update();

        if(this.gameOver) return;

        if(this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].completly_shown(this.screen.width))
        {
            this.obstacles.push(this.obstacle_selector.next());
        }
        this.obstacles.forEach(obstacle => obstacle.update(this.ctx));

        if(this.obstacles[0].out_of_screen())
        {
            this.obstacles.shift();
        }
    }

    draw_obstacles()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        this.player.draw(this.ctx);

        this.ctx.stroke();
    }

    check_gameOver()
    {
        return this.player.y > this.screen.height || this.check_obstacle_collision();
    }

    check_obstacle_collision()
    {
        for(let obstacle of this.obstacles)
        {
            if(obstacle.collision(this.player)) return true;
        }

        return false;
    }
}

export class Obstacle_Selector
{
    constructor(screen_width, screen_height)
    {
        this.screen_width = screen_width;
        this.screen_height = screen_height;

        this.obstacle_count = 0;
    }

    next()
    {
        this.obstacle_count++;
        if(!(this.obstacle_count%8))
        {
            return new Up_And_Down_Pipe(this.screen_width, 0, 400, this.screen_height, -3, 310, 90);
        }

        return new Normal_Pipe(this.screen_width, 0, 400, this.screen_height, -3, 310, 90)
    }
}