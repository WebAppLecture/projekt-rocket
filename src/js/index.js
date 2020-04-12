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
game.start_game();

console.log("Fertig mit Spiel!");