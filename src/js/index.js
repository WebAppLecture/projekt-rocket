import { Game } from "./Game.js";

let game = new Game(document.querySelector("#gameCanvas"));

document.querySelector("body").addEventListener("keydown", event => game.onKeyDown(event));

document.querySelectorAll(".difficulty_col").forEach(column => column.addEventListener("click", function(){
    
    for(let col of document.querySelectorAll(".difficulty_col"))
    {
        if(col === this) continue;

        for(let child of col.children)
        {
            child.classList.remove("difficulty_active");
        }
    }

    for(let child of this.children)
    {
        child.classList.add("difficulty_active");
    }

    game.change_difficulty(this.textContent.trim());
}));