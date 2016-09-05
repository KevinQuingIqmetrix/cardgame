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

describe("GetState",() => {
    let unit:api.TongitzApi;
    // describe("Succeeds", () => {
    //     it("when called with existing playerId", () => {
    //         //test data
    //         let gameId = 1, playerId = 1;

    //         let service = new svc.TongitzService(); //to be stubbed dependencies
    //         let stubFetchState = sinon.stub(service,"fetchState").returns({}) //stub dependencies

    //         unit = new api.TongitzApi(service); //instantiate unit tested module
    //         unit.GetState(gameId,playerId) //call tested function

    //         helper.restore(stubFetchState); //clean up
    //         //asserts
    //         helper.calledOnce(stubFetchState); //called once for every function supposed to be called
    //     });
    // })
    describe("Fails", () => {
        it("when service function throws an error", () => {
            //test data
            let gameId = 1, playerId = 1;

            let service = new svc.TongitzService(); //to be stubbed dependencies
            let stubFetchState = sinon.stub(service,"fetchState").throws() //stub dependencies; throws

            unit = new api.TongitzApi(service); //instantiate unit tested module
            expect(unit.GetState.bind(unit,gameId,playerId)).to.throw() //call tested function and expect throw

            helper.restore(stubFetchState); //clean up
            //asserts
            helper.calledOnce(stubFetchState); //called once for every function supposed to be called
        });
    })
})