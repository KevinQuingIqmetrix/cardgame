//Test dependencies
require("mocha")
import chai = require("chai")
import sinon = require("sinon")
import assert = chai.assert;
var should = chai.should();
import expect = chai.expect;
//helper
import helper = require("../testHelper")
//Module to unit test
import api = require('../../tongitz.api/TongitzApi')
//Dependencies to mock
import svc = require("../../tongitz.services/TongitzService")
import domain = require("../../tongitz.models/domain/_domain")

describe("Chow",() => {
    let unit:api.TongitzApi;
    let service: svc.TongitzService;
    let stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState,stubGetDiscards,stubGetHouses,stubAddHouse,stubSetWinner, stubGetWinMethod;
    beforeEach(() => {
            service = new svc.TongitzService();
            stubGetTurn = sinon.stub(service, "getTurn")
            stubGetPhase = sinon.stub(service, "getPhase")
            stubGetPlayer = sinon.stub(service, "getPlayer")
            stubGetPlayerCount = sinon.stub(service, "getPlayerCount")
            stubGetDeck = sinon.stub(service, "getDeck")
            stubApplyState = sinon.stub(service, "applyState")
            stubGetDiscards = sinon.stub(service, "getDiscards")
            stubGetHouses = sinon.stub(service, "getHouses")
            stubAddHouse = sinon.stub(service, "addHouse")
            stubSetWinner = sinon.stub(service, "setWinner")
            stubGetWinMethod = sinon.stub(service, "getWinMethod")
        })
        afterEach(() => { 
            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState,stubGetDiscards,stubGetHouses,stubAddHouse,stubSetWinner,stubGetWinMethod);
        })
    describe("Succeeds", () => {
        it("when called with called with valid params (not a win yet)", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            // stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(testData.sampleDiscards())
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            // stubGetWinMethod = sinon.stub(service, "getWinMethod")

            unit = new api.TongitzApi(service); 
            let result = unit.Chow(gameId,playerId,[24,22]) 
            
            //asserts
            helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubApplyState); 
            expect(stubSetWinner.notCalled).to.be.true;
        });
        it("when called with valid params (win chow)", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            // stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(testData.sampleDiscards())
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            // stubGetWinMethod = sinon.stub(service, "getWinMethod")

            unit = new api.TongitzApi(service); 
            let result = unit.Chow(gameId,playerId,[24,22,23]) 
            
            //asserts
            helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubApplyState); 
            //check if win. stubSetWinner is called 
            expect(stubSetWinner.calledOnce).to.be.true;
        });
    });
    describe("Fails", () => {
        it("when game turn is incorrect", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id != playerId)[0].turn)//anyone's turn but the test player's
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(t.playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(t.discards)
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner
            // stubGetWinMethod

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[24,23,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts
            // helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
        });
        it("when game turnphase is incorrect", () => {
            //test data
            let gameId = 1, playerId = 2;
 
            stubGetTurn.returns(2)
            stubGetPhase.returns(domain.turnPhaseEnum.play)
            stubGetPlayer.returns(testData.sampleGameState().playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(testData.sampleGameState().playerStatuses.length)
            stubGetDeck.returns(testData.sampleGameState().deck)
            // stubApplyState = sinon.stub(service, "applyState")

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[24,23,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts
            // helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
        });
        it("when duplicate card", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(t.playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(t.discards)
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            // stubGetWinMethod = sinon.stub(service, "getWinMethod")

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[24,24,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts
            // helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
        });
        
        it("when card is not player's", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(t.playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(t.discards)
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            // stubGetWinMethod = sinon.stub(service, "getWinMethod")

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[10,23,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
        it("when card does not form combination", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(t.playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(t.discards)
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            // stubGetWinMethod = sinon.stub(service, "getWinMethod")

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[24,23,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
        it("when game is already won", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow)
            stubGetPlayer.returns(t.playerStatuses.filter(x => x.id == playerId)[0])
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetDeck.returns(t.deck)
            // stubApplyState
            stubGetDiscards.returns(t.discards)
            stubGetHouses.returns(t.houses)
            // stubAddHouse
            // stubSetWinner = sinon.stub(service, "setWinner")
            stubGetWinMethod.returns(domain.winMethodEnum.leastHand)

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,[24,23,22])).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
    })
})

class testData {
    static sampleGameState (){
        return sampleGameState
    }
    static samplePstat (playerId:number) {
        let a = samplePlayerStatus;
        a.id = playerId;
        a.turn = playerId;
        return JSON.parse(JSON.stringify(a));
    }
    static sampleDiscards() {
        return JSON.parse(JSON.stringify(sampleDiscards));
    }
    static samplePstatWrongCombi (playerId:number){
        let a = samplePlayerStatusForWrongCombination;
        a.id = playerId;
        a.turn = playerId;
        return JSON.parse(JSON.stringify(a));
    }
    
}

let sampleGameState = {"playerStatuses":[{"id":1,"name":"p1","turn":1,"hand":[{"id":47,"rank":9,"suite":4},{"id":46,"rank":8,"suite":4},{"id":7,"rank":8,"suite":1},{"id":50,"rank":12,"suite":4},{"id":36,"rank":11,"suite":3},{"id":52,"rank":1},{"id":33,"rank":8,"suite":3},{"id":23,"rank":11,"suite":2},{"id":16,"rank":4,"suite":2},{"id":20,"rank":8,"suite":2},{"id":40,"rank":2,"suite":4},{"id":10,"rank":11,"suite":1},{"id":22,"rank":10,"suite":2}]},{"id":2,"name":"p2","turn":2,"hand":[{"id":48,"rank":10,"suite":4},{"id":49,"rank":11,"suite":4},{"id":19,"rank":7,"suite":2},{"id":25,"rank":13,"suite":2},{"id":39,"rank":1,"suite":4},{"id":43,"rank":5,"suite":4},{"id":24,"rank":12,"suite":2},{"id":30,"rank":5,"suite":3},{"id":51,"rank":13,"suite":4},{"id":31,"rank":6,"suite":3},{"id":21,"rank":9,"suite":2},{"id":6,"rank":7,"suite":1}]},{"id":3,"name":"p3","turn":3,"hand":[{"id":34,"rank":9,"suite":3},{"id":11,"rank":12,"suite":1},{"id":42,"rank":4,"suite":4},{"id":38,"rank":13,"suite":3},{"id":26,"rank":1,"suite":3},{"id":44,"rank":6,"suite":4},{"id":37,"rank":12,"suite":3},{"id":29,"rank":4,"suite":3},{"id":2,"rank":3,"suite":1},{"id":14,"rank":2,"suite":2},{"id":35,"rank":10,"suite":3},{"id":27,"rank":2,"suite":3}]}],"deck":[{"id":15,"rank":3,"suite":2},{"id":18,"rank":6,"suite":2},{"id":8,"rank":9,"suite":1},{"id":13,"rank":1,"suite":2},{"id":3,"rank":4,"suite":1},{"id":5,"rank":6,"suite":1},{"id":41,"rank":3,"suite":4},{"id":28,"rank":3,"suite":3},{"id":17,"rank":5,"suite":2},{"id":45,"rank":7,"suite":4},{"id":1,"rank":2,"suite":1},{"id":4,"rank":5,"suite":1},{"id":32,"rank":7,"suite":3},{"id":9,"rank":10,"suite":1},{"id":12,"rank":13,"suite":1}],"discards":[],"houses":[],"error":[],"id":1,"turn":1,"turnPhase":2};
let samplePlayerStatus = {"id":1,"name":"p1","turn":1,"hand":[
    {"id":24,"rank":11,"suite":1},{"id":22,"rank":10,"suite":1},{"id":23,"rank":12,"suite":1}]};
let sampleDiscards = [new domain.playedCard(new domain.card(25,9,1),3,3)]

let samplePlayerStatusForWrongCombination = {"id":1,"name":"p1","turn":1,"hand":[
    {"id":24,"rank":11,"suite":1},{"id":22,"rank":10,"suite":2},{"id":23,"rank":12,"suite":3}]};