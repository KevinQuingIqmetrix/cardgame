require("mocha")
import chai = require("chai")
import sinon = require("sinon")

import assert = chai.assert;
chai.should()

import api = require('../../tongitz.api/TongitzApi')
import TongitzService = require("../../tongitz.services/TongitzService")


describe("NewGame",() => {

})




/**
 * search
 * 
 * how to tsc only from specific folders
 * how to run mocha on separate folders, this is if the test folders will be in each folder
 * EXAMPLE:
 * -tongitz.api/tests
 * -tongitz.services/tests
 * 
 * tongitz.services can be remodeled to return only whats needed. the first one to be fetched will store the gameState
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