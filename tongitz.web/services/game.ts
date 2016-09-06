
function gameServices(expressApp, tongitzApi) {
  expressApp.post("/api/game/new", (req, res) => {
    let {gameId, players} = req.body;
    return tongitzApi.NewGame(gameId, players);
  });
  expressApp.post("/api/game/chow", (req, res) => {
    let {gameId, playerId, cards} = req.body;
    return tongitzApi.Chow(gameId, playerId, cards);
  });
  expressApp.get("/api/game/draw", (req, res) => {
    let {gameId, playerId} = req.query;
    return tongitzApi.Draw(gameId, playerId);
  });
  expressApp.post("/api/game/play", (req, res) => {
    let {gameId, playerId, playCards} = req.body;
    return tongitzApi.Play(gameId, playerId, playCards);
  });
}

export = gameServices;
