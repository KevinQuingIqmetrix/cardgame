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
import resource = require("../../tongitz.models/resource/_resource")

describe("Play",() => {
    let unit:api.TongitzApi;
    let service: svc.TongitzService;
    let stubGetTurn      :sinon.SinonStub
        ,stubGetPhase        :sinon.SinonStub
        ,stubGetPlayer       :sinon.SinonStub
        ,stubGetPlayerCount  :sinon.SinonStub
        ,stubGetDeck         :sinon.SinonStub
        ,stubApplyState      :sinon.SinonStub
        ,stubGetDiscards     :sinon.SinonStub
        ,stubGetHouses       :sinon.SinonStub
        ,stubAddHouse        :sinon.SinonStub
        ,stubSetWinner       :sinon.SinonStub
        ,stubGetWinMethod    :sinon.SinonStub
        ,stubGetPlayers      :sinon.SinonStub;
    let stubs:sinon.SinonStub[];
    beforeEach(() => {
            service = new svc.TongitzService();
            stubs = [];
            stubGetTurn = sinon.stub(service, "getTurn"); stubs.push(stubGetTurn);
            stubGetPhase = sinon.stub(service, "getPhase"); stubs.push(stubGetPhase);
            stubGetPlayer = sinon.stub(service, "getPlayer"); stubs.push(stubGetPlayer);
            stubGetPlayerCount = sinon.stub(service, "getPlayerCount"); stubs.push(stubGetPlayerCount);
            stubGetDeck = sinon.stub(service, "getDeck"); stubs.push(stubGetDeck);
            stubApplyState = sinon.stub(service, "applyState"); stubs.push(stubApplyState);
            stubGetDiscards = sinon.stub(service, "getDiscards"); stubs.push(stubGetDiscards);
            stubGetHouses = sinon.stub(service, "getHouses"); stubs.push(stubGetHouses);
            stubAddHouse = sinon.stub(service, "addHouse"); stubs.push(stubAddHouse);
            stubSetWinner = sinon.stub(service, "setWinner"); stubs.push(stubSetWinner);
            stubGetWinMethod = sinon.stub(service, "getWinMethod"); stubs.push(stubGetWinMethod);
            stubGetPlayers = sinon.stub(service,"getPlayers"); stubs.push(stubGetPlayers);
        })
        afterEach(() => { 
            helper.restore(...stubs);
        })
    describe("Succeeds", () => {
        it("when called with valid params (not a win yet)", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play)
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            let result = unit.Play(gameId,playerId,testData.sampleReqNotWin()) 
            
            //asserts
            helper.calledOnce(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubApplyState); 
            expect(stubSetWinner.notCalled).to.be.true;
        });
        it("when called with valid params (win play)", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play)
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            let result = unit.Play(gameId,playerId,testData.sampleReqWin()) 
            
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

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id != playerId)[0].turn) //all but the player's turn
            stubGetPhase.returns(domain.turnPhaseEnum.play)
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqNotWin())).to.throw() 
            
            //asserts
            expect(stubSetWinner.notCalled).to.be.true;
        });
        it("when game turnphase is incorrect", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.drawOrChow) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqNotWin())).to.throw() 
            
            //asserts
            expect(stubSetWinner.notCalled).to.be.true;
        });
        it("when duplicate card", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqDupCard())).to.throw() 
            
            //asserts
            expect(stubSetWinner.notCalled).to.be.true;
        });
        
        it("when card is not player's", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();

            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqWrongCard())).to.throw() 
            
            //asserts
            expect(stubSetWinner.notCalled).to.be.true;
        });
        it("when player's new house cards does not form combination", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqWrongCombiHouse())).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
        it("when player's sapaw cards does not form combination", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubSetWinner.returns(null);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Play.bind(unit,gameId,playerId,testData.sampleReqWrongCombiSapaw())).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
        it("when game is already won", () => {
            //test data
            let gameId = 1, playerId = 2, t = testData.sampleGameState();
 
            stubSetWinner.returns(domain.winMethodEnum.leastHand);
            stubGetTurn.returns(t.playerStatuses.filter(x => x.id == playerId)[0].turn)
            stubGetPhase.returns(domain.turnPhaseEnum.play) //not play turn
            stubGetPlayer.returns(testData.samplePstat(playerId))
            stubGetPlayerCount.returns(t.playerStatuses.length)
            stubGetHouses.returns(testData.sampleGameHouses())
            stubGetDiscards.returns(testData.sampleGameDiscards())

            unit = new api.TongitzApi(service); 
            expect(unit.Chow.bind(unit,gameId,playerId,testData.sampleReqWin())).to.throw(); 

            helper.restore(stubGetTurn,stubGetPhase,stubGetPlayer,stubGetPlayerCount,stubGetDeck,stubApplyState); 
            //asserts 
        });
    })
})

class testData {
    static sampleGameState (){
        return this.clone(sampleGameState)
    }
    static samplePstat (playerId:number) {
        let a = samplePlayerStatus;
        a.id = playerId;
        a.turn = playerId;
        return this.clone(a)
    }
    static sampleGameDiscards() {
        return this.clone(sampleGameDiscards);
    }
    static samplePstatWrongCombi (playerId:number){
        let a = samplePlayerStatusForWrongCombination;
        a.id = playerId;
        a.turn = playerId;
        return this.clone(a)
    }
    static sampleGameHouses(){
        return this.clone(sampleGameHouses)
    }
    static sampleReqNotWin(){
        return this.clone(sampleReqNotWin);
    }
    static sampleReqWin(){
        return this.clone(sampleReqWin);
    }
    static sampleReqDupCard(){
        return this.clone(sampleReqDupCard);
    }
    static sampleReqWrongCard(){
        return this.clone(sampleReqWrongCard);
    }
    static sampleReqWrongCombiHouse(){
        return this.clone(sampleReqWrongCombiHouse)
    }
    static sampleReqWrongCombiSapaw(){
        return this.clone(sampleReqWrongCombiSapaw)
    }

    static clone (aa:any){
        return JSON.parse(JSON.stringify(aa))
    }
}

let sampleGameState = {"playerStatuses":[{"id":1,"name":"p1","turn":1,"hand":[{"id":47,"rank":9,"suite":4},{"id":46,"rank":8,"suite":4},{"id":7,"rank":8,"suite":1},{"id":50,"rank":12,"suite":4},{"id":36,"rank":11,"suite":3},{"id":52,"rank":1},{"id":33,"rank":8,"suite":3},{"id":23,"rank":11,"suite":2},{"id":16,"rank":4,"suite":2},{"id":20,"rank":8,"suite":2},{"id":40,"rank":2,"suite":4},{"id":10,"rank":11,"suite":1},{"id":22,"rank":10,"suite":2}]},{"id":2,"name":"p2","turn":2,"hand":[{"id":48,"rank":10,"suite":4},{"id":49,"rank":11,"suite":4},{"id":19,"rank":7,"suite":2},{"id":25,"rank":13,"suite":2},{"id":39,"rank":1,"suite":4},{"id":43,"rank":5,"suite":4},{"id":24,"rank":12,"suite":2},{"id":30,"rank":5,"suite":3},{"id":51,"rank":13,"suite":4},{"id":31,"rank":6,"suite":3},{"id":21,"rank":9,"suite":2},{"id":6,"rank":7,"suite":1}]},{"id":3,"name":"p3","turn":3,"hand":[{"id":34,"rank":9,"suite":3},{"id":11,"rank":12,"suite":1},{"id":42,"rank":4,"suite":4},{"id":38,"rank":13,"suite":3},{"id":26,"rank":1,"suite":3},{"id":44,"rank":6,"suite":4},{"id":37,"rank":12,"suite":3},{"id":29,"rank":4,"suite":3},{"id":2,"rank":3,"suite":1},{"id":14,"rank":2,"suite":2},{"id":35,"rank":10,"suite":3},{"id":27,"rank":2,"suite":3}]}],"deck":[{"id":15,"rank":3,"suite":2},{"id":18,"rank":6,"suite":2},{"id":8,"rank":9,"suite":1},{"id":13,"rank":1,"suite":2},{"id":3,"rank":4,"suite":1},{"id":5,"rank":6,"suite":1},{"id":41,"rank":3,"suite":4},{"id":28,"rank":3,"suite":3},{"id":17,"rank":5,"suite":2},{"id":45,"rank":7,"suite":4},{"id":1,"rank":2,"suite":1},{"id":4,"rank":5,"suite":1},{"id":32,"rank":7,"suite":3},{"id":9,"rank":10,"suite":1},{"id":12,"rank":13,"suite":1}],"discards":[],"houses":[],"error":[],"id":1,"turn":1,"turnPhase":2};

let sampleGameDiscards = [new domain.playedCard(new domain.card(25,9,1),3,3)]

let samplePlayerStatusForWrongCombination = {"id":1,"name":"p1","turn":1,"hand":[
    {"id":24,"rank":11,"suite":1},{"id":22,"rank":10,"suite":2},{"id":23,"rank":12,"suite":3}]};



let sampleGameHouses:domain.house[] = [
    {id:1,playerId:1,cards:[
            {id:1,playerId:1,rank:2,suite:2,turn:2} as domain.playedCard,
            {id:2,playerId:1,rank:3,suite:2,turn:2} as domain.playedCard,
            {id:3,playerId:1,rank:4,suite:2,turn:2} as domain.playedCard
        ]}as domain.house
    ]
let samplePlayerStatus = {"id":1,"name":"p1","turn":1,"hand":[
    {"id":24,"rank":11,"suite":1},{"id":22,"rank":10,"suite":1},{"id":23,"rank":12,"suite":1},//house
    {"id":26,"rank":5,"suite":2},//sapaw
    {"id":27,"rank":5,"suite":3},//discard
    {"id":28,"rank":6,"suite":2}//hand left on not win
    ]};
let sampleReqNotWin = new resource.playRequestResource();
sampleReqNotWin.discard = 27;
sampleReqNotWin.houses = [[24,22,23]]
sampleReqNotWin.sapaw = [{houseId:1,cardId:[26]} as resource.sapawResource]

let sampleReqWin = new resource.playRequestResource();
sampleReqWin.discard = 27;
sampleReqWin.houses = [[24,22,23]]
sampleReqWin.sapaw = [{houseId:1,cardId:[26,28]} as resource.sapawResource]

let sampleReqDupCard = new resource.playRequestResource();
sampleReqDupCard.discard = 23;
sampleReqDupCard.houses = [[24,22,23]]
sampleReqDupCard.sapaw = [{houseId:1,cardId:[26,28]} as resource.sapawResource]
let sampleReqWrongCard = new resource.playRequestResource();
sampleReqWrongCard.discard = 23;
sampleReqWrongCard.houses = [[24,22,23]]
sampleReqWrongCard.sapaw = [{houseId:1,cardId:[26,32]} as resource.sapawResource]

let sampleReqWrongCombiHouse = new resource.playRequestResource();
sampleReqWrongCombiHouse.discard = 23;
sampleReqWrongCombiHouse.houses = [[24,22,27]]
sampleReqWrongCombiHouse.sapaw = [{houseId:1,cardId:[26,32]} as resource.sapawResource]

let sampleReqWrongCombiSapaw = new resource.playRequestResource();
sampleReqWrongCombiSapaw.discard = 26;
sampleReqWrongCombiSapaw.houses = [[24,22,23]]
sampleReqWrongCombiSapaw.sapaw = [{houseId:1,cardId:[27,32]} as resource.sapawResource]