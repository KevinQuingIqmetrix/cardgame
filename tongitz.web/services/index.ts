import game = require("./game");
import gameState = require("./gameState");

function registerServices(app, tongitzApi) {
  game(app, tongitzApi);
  gameState(app, tongitzApi);
}

export = registerServices;
