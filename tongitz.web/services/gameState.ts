
function gameStateServices (expressApp) {
  expressApp.get("/api/gamestate", (req, res) => {
    let {id, playerId} = req.query;
  });
  expressApp.get("/api/gamestate/check", (req, res) => {
    let {id, playerId, turn} = req.query;
  });
}

export = gameStateServices;
