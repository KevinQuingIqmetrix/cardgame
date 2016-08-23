import {gameStateResource} from "../tongitz.models/resource/gameStateResource"
import {gameState} from "../tongitz.models/domain/gameState"

export class mapper{
    public static gameStateToResource(gameState:gameState){
        let gameStateResource = {} as gameStateResource;
        return gameStateResource
    }
}