
function gameStateServices (expressApp, tongitzApi) {
  expressApp.get("/api/gamestate", (req, res) => {
    let {gameId, playerId} = req.query;
    return tongitzApi.GetState(gameId, playerId);
  });
  expressApp.get("/api/gamestate/check", (req, res) => {
    let {gameId, playerId, turn} = req.query;
    return tongitzApi.CheckState(gameId, playerId, turn);
  });
}

export = gameStateServices;
