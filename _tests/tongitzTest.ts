//Test framework
require("mocha")
import chai = require("chai")
import sinon = require("sinon")
import assert = chai.assert;
chai.should()
import expect = chai.expect;
//Module to unit test
import api = require('../tongitz.api/TongitzApi')
//Dependencies to mock
import svc = require("../tongitz.services/TongitzService")

//Tests
describe("Api Tests", () => {
    require("./api/newGame")
})

