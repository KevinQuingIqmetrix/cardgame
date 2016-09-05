import game = require("./game");
import gameState = require("./gameState");

function registerServices(app) {
  game(app);
  gameState(app);
}

export = registerServices;
