import sinon = require("sinon")

export function restore(...stubs:sinon.SinonStub[]){
    stubs.forEach(x => x.restore());
}
export function calledOnce(...stubs:sinon.SinonStub[]){
    stubs.forEach(x => x.calledOnce.should.be.true);
}