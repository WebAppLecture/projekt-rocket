import {Normal_Pipe} from "./Obstacle.js"

export class Game
{
    constructor(screen)
    {
        this.screen = screen;
        this.ctx = this.screen.getContext("2d");

        this.width = screen.width;
        this.height = screen.height;
    }

    start_game()
    {   
        this.gameOver = false;
        this.obstacles = [];


        while(!this.gameOver)
        {
            this.update_obstacles();
            this.draw_obstacles();

            console.log("Schleife");
        }

    }

    update_obstacles()
    {
        if(this.obstacles.length === 0 || this.obstacles[0].completly_shown(this.screen.width))
        {
            this.obstacles.push(new Normal_Pipe(this.width, 0, this.height, 400, 3, 320, 100));
        }

        this.obstacles.forEach(obstacle => obstacle.update(this.ctx));
    }

    draw_obstacles()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
    }
}