
function gameServices(expressApp) {
  expressApp.post("/api/game/new", (req, res) => {
    let {id, players} = req.body;
  });
  expressApp.post("/api/game/chow", (req, res) => {
    let {id, playerId, card} = req.body;
  });
  expressApp.get("/api/game/draw", (req, res) => {
    let {id, playerId} = req.query;
  });
  expressApp.post("/api/game/play", (req, res) => {
    let {id, playerId, playCards} = req.body;
  });
}

export = gameServices;
