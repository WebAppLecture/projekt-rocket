import {Player} from "./Obstacle.js"
import {Background_Image_Handler, TextContainer, GameOverScreen} from "./Container.js"
import {Normal_Pipe, Up_And_Down_Pipe, Corridor_Pipe, Closing_Pipe} from "./Pipes.js"

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

        this.background_image = new Background_Image_Handler(0, 100, screen.width, screen.height);
        this.background_image.draw(this.ctx);

        this.setup_score_display(this.width / 2 - 10, 50, 60, 60);
        this.gameOverScreen = new GameOverScreen(250, 50, 300, 300);

        new TextContainer(100, 50, 600, 35, "Drücke die Leertaste, um mit dem Spiel zu beginnen!", "25px Impact", "LightGray").draw(this.ctx);
    }

    setup_controls()
    {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    onKeyDown(event)
    {
        //console.log("Eingabe registriert: \"" + event.key + "\"!");

        //console.log(this.player.y + " " + this.screen.height + " " + this.gameOver);

        
        if(event.key === " " || event.key === "Spacebar")
        {
            event.preventDefault();

            if(event.repeat) return;

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

        this.background_image.x = 0;

        this.player = new Player(200, 300, 70, 49);
        this.gameOver = false;
        this.score_display.text = 0;
        this.gameOverScreen.update(0);

        this.gameloop();

    }

    setup_score_display(x, y, width, height)
    {
        let grad = this.ctx.createRadialGradient(x, y + height/2, 0, x, y + height/2, width/2);
        grad.addColorStop(0, "LightGray");
        grad.addColorStop(1, "brown");


        this.score_display = new TextContainer(x - width/2, y, width, height, 0, "30px Impact", "black", grad);
    }

    gameloop()
    {
        if(this.player.y < this.screen.height)
        {
            requestAnimationFrame(this.gameloop.bind(this));
            this.update_obstacles();
            this.draw();  
            this.gameOver = this.check_gameOver() || this.gameOver;
        }
        else{
            this.gameOverScreen.draw(this.ctx);
        }
    }

    update_obstacles()
    {
        this.player.update();

        if(this.gameOver)
        {
            this.player.vx = 3;
             return;
        }

        if(this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].completly_shown(this.screen.width))
        {
            this.obstacles.push(this.obstacle_selector.next());
            console.log("added new Pipes!");
        }
        this.obstacles.forEach(obstacle => obstacle.update(this.ctx));

        let end_of_first_obstacle = this.obstacles[0].x + this.obstacles[0].width 
        if(this.player.x-3 < end_of_first_obstacle && end_of_first_obstacle < this.player.x)
        {
            this.gameOverScreen.update(++this.score_display.text)
        }

        //console.log(this.obstacles[0].out_of_screen() + " " + this.obstacles[0].x +" " + this.obstacles[0].width);
        if(this.obstacles[0].out_of_screen())
        {
            this.obstacles.shift();
        }

        this.background_image.update();
    }

    draw()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.background_image.draw(this.ctx);

        this.ctx.beginPath();
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        this.player.draw(this.ctx);

        this.ctx.stroke();

        this.score_display.draw(this.ctx);
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
        if(!(++this.obstacle_count%2))
        {
            switch(Math.floor(Math.random()*3))
            {
                case 0: return new Corridor_Pipe(this.screen_width, 0, 800, this.screen_height, -3, 310, 90);
                case 1: return new Up_And_Down_Pipe(this.screen_width, 0, 400, this.screen_height, -3, 310, 90);
                case 2: return new Closing_Pipe(this.screen_width, 0, 400, this.screen_height, -3, 310, 200);
            }
        }

        return new Normal_Pipe(this.screen_width, 0, 400, this.screen_height, -3, 310, 90);
    }
}