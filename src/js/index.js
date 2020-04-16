/*fetch("src/data/data.json")
    .then(e => e.json())
    .then(json => {
        let title = document.createElement("h2"),
            content = document.createElement("p"),
            image = document.createElement("img");

        title.innerHTML = json.title;
        content.innerHTML = json.content;
        image.setAttribute("src", "./src/images/sql magic.jpg");

        document.body.appendChild(title);
        document.body.appendChild(content);
        document.body.appendChild(image);
    });*/

import { Game } from "./Game.js";


console.log("Starte...")
let game = new Game(document.querySelector("#gameCanvas"));

document.querySelector("body").addEventListener("keydown", event => game.onKeyDown(event));

document.querySelectorAll(".difficulty_col").forEach(col => col.addEventListener("click", function(){
    
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

console.log("Fertig mit Spiel!");