declare var require: any;//do not move

//3rd party
var fs = require("fs");
const writeFiles = require('write-files');
//models
import {gameState} from "../tongitz.models/domain/gameState"

const ff = "json"; //fileformat
export interface ITongitzService {
    saveState(gameState:gameState,id?:number);
    loadState(id?:number): gameState;
}
export class TongitzService {
    public saveState(gameState:gameState,id?: number)
    {
        id = id ? id : 1;
        this.saveToFile(JSON.stringify(gameState),id);
    }
    public loadState(gameId?:number): gameState{
        gameId = gameId ? gameId : 1;
        return JSON.parse(this.loadFromFile(gameId)) as gameState;
    }
    saveToFile(json: string, id:number) {
        // let filename = `tong${id}.${ff}`
        // let filejson = `{${filename}:{}}`;
        // let file = JSON.parse(filejson)
        let file = {"game.json":json}
        writeFiles(file, err => {
            if(err) {
                console.log(err);
                throw err;
            }
        })
    }
    loadFromFile(fileName: number){
        // let fileString:string = fs.readFileSync(`tong${fileName}.${ff}`, 'utf8');
        let fileString:string = fs.readFileSync("game.json")
        return fileString;
    }
}