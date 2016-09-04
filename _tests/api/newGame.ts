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


describe("NewGame",() => {
    let unit:api.TongitzApi;
    describe("Succeeds", () => {

        it("when called with 2 players", () => {
            //test data
            let gameid = 1, p = ["test1","test2"]

            let service = new svc.TongitzService(); //to be stubbed dependencies

            let stubAddGame = sinon.stub(service,"addGame") //stub dependencies
            ,   stubSetDeck = sinon.stub(service,"setDeck")
            ,   stubApplyState = sinon.stub(service,"applyState")

            unit = new api.TongitzApi(service); //instantiate unit tested module
            unit.NewGame(gameid,...p) //call tested function

            helper.restore(stubAddGame,stubSetDeck,stubApplyState); //clean up
            //asserts
            helper.calledOnce(stubAddGame,stubSetDeck,stubApplyState); //called once for every function supposed to be called
            stubAddGame.calledWith(gameid,1,2).should.be.true;
            stubSetDeck.args[0].length.should.be.equal(2);
            stubSetDeck.args[0][0].should.be.equal(1);
            stubSetDeck.args[0][1].should.have.length(52-((p.length*12)+1))
        });
        it("when called with 3 players", () => {
            //test data
            let gameid = 1, p = ["test1","test2","test3"];

            let service = new svc.TongitzService(); //to be stubbed dependencies

            let stubAddGame = sinon.stub(service,"addGame") //stub dependencies
            ,   stubSetDeck = sinon.stub(service,"setDeck")
            ,   stubApplyState = sinon.stub(service,"applyState")

            unit = new api.TongitzApi(service); //instantiate unit tested module
            unit.NewGame(gameid,...p) //call tested function

            helper.restore(stubAddGame,stubSetDeck,stubApplyState); //clean up
            //asserts
            helper.calledOnce(stubAddGame,stubSetDeck,stubApplyState); //called once for every function supposed to be called
            stubAddGame.calledWith(gameid,1,2).should.be.true;
            stubSetDeck.args[0].length.should.be.equal(2); //2 parameters when setting deck
            stubSetDeck.args[0][0].should.be.equal(gameid); //game id
            stubSetDeck.args[0][1].should.have.length(52-((p.length*12)+1)) //cards left in deck  
        });
    });
    describe("Fails", () => {
        it("when called with 1 player", () => {
            //test data
            let gameid = 1, p = ["test1"]

            let service = new svc.TongitzService(); //to be stubbed dependencies

            let stubAddGame = sinon.stub(service,"addGame") //stub dependencies
            ,   stubSetDeck = sinon.stub(service,"setDeck")
            ,   stubApplyState = sinon.stub(service,"applyState")

            unit = new api.TongitzApi(service); //instantiate unit tested module
            expect(unit.NewGame.bind(unit,gameid,...p)).to.throw();

            helper.restore(stubAddGame,stubSetDeck,stubApplyState); //clean up
        }) 
        it("when service method called throws an error", () => {
            //test data
            let gameid = 1, p = ["test1"]

            let service = new svc.TongitzService(); //to be stubbed dependencies

            let stubAddGame = sinon.stub(service,"addGame") //stub dependencies
            ,   stubSetDeck = sinon.stub(service,"setDeck")
            ,   stubApplyState = sinon.stub(service,"applyState").throws()
            
            unit = new api.TongitzApi(service); //instantiate unit tested module
            expect(unit.NewGame.bind(unit,gameid,...p)).to.throw();

            helper.restore(stubAddGame,stubSetDeck,stubApplyState); //clean up
        })
    })
})




/**
 * search
 * 
 * how to tsc only from specific folders
 * 
 * how to run mocha on separate folders, this is if the test folders will be in each folder
 * EXAMPLE:
 * -tongitz.api/tests
 * -tongitz.services/tests
 * 
 * tongitz.services can be remodeled to return only whats needed. the first one to be fetched will store the gameState --DONE
 * EXAMPLE:
 * (Constructor: this.service = new service())
 * validatePhase(this.service.getTurnPhase)
 * validateCard(this.service.getCards)
 * 
 * this.service = new service() - this instantiates service which still have no gameState data
 * this.service.getTurnPhase - will get the whole gameState and store it in variable (example: currentGameState)
 * this.service.getCards - checks if currentGameState is not null. if true, return currentGameState.cards
 * 
 * @@@ how does typescript generate js when params are (id?:number,...name:string[])
 * 
 * @@@ This is cool: enumerate as args a listVariable and pass it to a function expecting args
 *   private flatten(obj:Object){
 *       var a = [1,2]
 *       let b:number[] = [];
 *       b.push(...a);
 *   }
 */