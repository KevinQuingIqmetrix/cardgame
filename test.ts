////tuple test: to access, index is used. as if a normal array.
// var a:[number,string] = [1,"asdf"]
// var b:[number,string][] = [[1,"asdF"],[2,"asdF"]]

function log(s:any){
    console.log(s)
}
// let c = [{},{}]
// log(b[0])
// log(b[1])
// log(b[2])

////Modulo -1 +1 test: good way for determining turn
// let x = 1;//turn
// let n = 3;//number of players
// let ttp: [number,number][] = [];//turn to player
// for(;x<30;x++)
// {
//     ttp.push([x,((x-1)%n)+1])
// }
// log(ttp)

////private prop with public getter with no setter test: inconclusive
////possible if there is a public setter but it sucks
////possible if put upon initialization
// interface cc{
// }
// class dd {
//     private pid:number
//     id(){return this.pid;}
//     public name:string
// }

// log(dd)
// let a = {name:"Asdf"} as dd;
// log(a.id())

////inherit function signature: can inheriting function have more parameters than the inherited function?
// interface myfunc{
//     (p1:string,p2:number):number
// }
////this is not how it works
// function inheritFunc (p1,p2): myfunc {
// return 1;
// }
////when using inheritFunch, parameters from myFunc needs to be present
// let inheritFunch: myfunc;
// inheritFunch = function (){
//     return 1;
// }
// // inheritFunch()
// inheritFunch("12#",2)
// class funcPlay{
//     blah():myfunc{
//         return function():any{

//         };
//     }
// }

// //// how web would implement the api contract
// ////because web.service = api
// interface itongitz{
//     asdf(asdf:number)
//     asfdg(asdf:string)
// }
// class api implements itongitz{
//     seravice = {
//         a(asdf){},
//         b(asdf){}
//     };
//     asdf(asdf){
//         this.seravice.a(asdf)
//     }
//     asfdg(asdf){
//         this.seravice.b(asdf)
//     }
// }
// class httpApi {
// sendRequest(...p){//http thirdparty
//     //calls webapi: api
// }
// }
// class webService implements itongitz{
//     api:httpApi;
//     constructor() {
//         //calls api using stringg: HTTP
//         let api = new httpApi;
//     }
//     asdf(asdf){
//         this.api.sendRequest("asdf",asdf)
//     }
//     asfdg(asdf){
//         this.api.sendRequest("asdfg",asdf)
//     }
// }

// enum suite {
//     clover=1,
//     hearts
// }
// class card {
//     constructor(
//     public rank:number,
//     public suite:suite
//     ) { }
// }
// class playedCard extends card{
//     constructor(
//         card:card,
//         turn:number,
//         playerId:number) {
//         super(card.rank,card.suite);
//     }
// }
// function sortCards
// (cards:card[]) : boolean{
//         // let isFlush = cards.every(x => x.suite == cards[0].suite);
//         cards = cards.sort((a,b) => a.rank - b.rank);
//         return cards.every((c,i) => cards.indexOf(c) == i)
//         // return cards.every((c,i) => cards.map(c => c.rank).indexOf(c.rank) == i)
//         // return true 
//     }
// let cards1:card[] = [{rank:10},{rank:2},{rank:13}]
// let cards2:card[] = [{rank:10},{rank:2},{rank:13},{rank:10}]
// log(sortCards(cards1));
// log(cards1)
// log(sortCards(cards2)); //THis is weird
// log(cards2)
// //does setting the value affect parameter outside method?
// //check also if just adding or changing a single value in a list affect param outside method.
// function cd(cards:number[]) : boolean{//check duplicate exists
//         return cards.every((c,i) => cards.indexOf(c) == i) 
//     }
// log(cd([10,2,13]))
// log(cd([10,2,13,10,12]))

// //Testing isStraightFlush function: success
// function isStraightFlush(cards:card[]) : boolean{
//         let isFlush = cards.every(x => x.suite == cards[0].suite);
//         cards = cards.sort((p,n) => p.rank - n.rank);
//         let is1Consecutive = cards.every((x,i) => ((cards[i+1-(Math.floor((i+1)/4))].rank) - x.rank) < 2)
//         return (isFlush && is1Consecutive) 
//     }

// let cardSet:card[] = [
//     new card(4,suite.hearts),
//     new card(2,suite.hearts),
//     new card(3,suite.hearts),
//     new card(5,suite.hearts)
// ]
// log(cardSet)
// log(isStraightFlush(cardSet))
// log(cardSet)

// //Test if playedCard translated to card then to playedCard loses playedcard properties
// //RESULT: it does not. please try list scenario..
// enum suite {
//     clover=1,
//     hearts
// }
// class card {
//     constructor(
//     public rank:number,
//     public suite:suite
//     ) { }
// }
// class playedCard extends card{
//     constructor(
//         public card:card,
//         public turn:number,
//         public playerId:number) {
//         super(card.rank,card.suite);
//     }
// }

// function pcAsC (playedCard: playedCard) :card{
// return playedCard as card
// }
// let pc:playedCard = new playedCard(new card(1,suite.clover),2,1)

// log(pc)
// log(pcAsC(pc));
// log(pc)


////Test override push of list property in class
////fail: maximum callstack exceeded
// class card {
//     constructor(
//     public rank:number
//     ) { }
//     public id:number
// }
// class player {
//     constructor() {
//         let that = this;
//         // that.cards = [];
//         this.cards.push = function (card:card) {
//             let orderedCards = that.cards.sort((x,y) => x.id - y.id);
//             let lastId = orderedCards[orderedCards.length-1] ? orderedCards[orderedCards.length-1].id : 1 
//             while(that.cards.map(c => c.id).indexOf(lastId) != -1)
//                 lastId += 1;
//             card.id = lastId
//             Array.prototype.push(

//             )
//             that.cards.push(card);
//             return that.cards.length;
//         }
//     }
//     public name: string
//     public cards:card[] = []
// }

// // let pl = {} as player
// // pl.cards.push(new card(1))
// let pl2 = new player();
// pl2.cards.push(new card(1))

// ////Test: // var list, filter, store in other var, splice. check list if changed
// class person{
//     constructor(
//         public id: number,
//         public name: string
//     ) {   
//     }
// }
// class collegeClass{
//     constructor(
        
//     public id:number,
//     public className:string,
//     public students: person[]
//     ) {
//     }
// }
// let classes:collegeClass[] = [];
// classes.push(new collegeClass(1,"class1",[]),new collegeClass(2,"class2",[]), new collegeClass(3,"3class",[]));
// classes[0].students.push(new person(1,"will"),new person(2,"bryers"))
// classes[1].students.push(new person(3,"adfa"),new person(4,"lkna"),new person(5,"asdf"))
// log("classes-------------")
// log(classes)
// let chosenClass = classes.filter(x => x.id == 2)[0]
// log("chosenclass-------------")
// log(chosenClass)
// // let chosenStudent = chosenClass.students.splice(1,1)[0]
// log("chosenStudent-------------")
// // log(chosenStudent)
// log("classes 2nd-------------")
// log(classes)

// // log(classes)
// // let chosenStudent = classes.filter(x => x.id == 2)[0].students.splice(4,1)[0]
// // log("-------------")
// // log(classes)
// // log(chosenStudent)

class sapawResource {
    houseId: number;
    cardId: number[] = [];
}
class playRequestResource {
    sapaw?:sapawResource[] = [];
    house?:number[][] = [];
    discard?:number;
}
// function flatten(obj:playRequestResource): number[]{//type should be playRequestResource
//     let flatCardIds:number[] = [];
//     let sampleReq = new playRequestResource();
//     sampleReq.discard=0;
//     // log(typeof(obj.house))
//     // log(typeof(sampleReq["house"]))
//     if(typeof(obj.discard) == typeof(sampleReq["discard"]) && obj.discard)
//         flatCardIds.push(obj.discard);
//     if(typeof(obj.house) == typeof(sampleReq["house"]) && obj.house)
//         obj.house.forEach(x => flatCardIds.push(...x))
//     if(typeof(obj.sapaw) == typeof(sampleReq["sapaw"]) && obj.sapaw)
//         obj.sapaw.forEach(x => flatCardIds.push(...x.cardId))


//     // typeof(obj.discard) == typeof(playRequestResource["discard"]) && ? flatCardIds.push(obj.discard) : null;
//     // obj.house ? obj.house.forEach(x => flatCardIds.push(...x)) : null
//     // obj.sapaw ? obj.sapaw.forEach(x => flatCardIds.push(...x.cardId)) : null
//     return flatCardIds;
// }
// // //tests
// // //empty anonymous
// // console.log(flatten({}))
// // //empty playRequestResource
// // console.log(flatten({} as playRequestResource))
// // //extra property and wrong key name
// // console.log(flatten({asdf:1, discards:[[1,2],[2,3]]} as playRequestResource))
// // console.log(flatten({asdf:1, discard:[[1,2],[2,3]]} as any as playRequestResource))
// // console.log(flatten({asdf:1, discard:[1]} as any as playRequestResource))
// // console.log(flatten({asdf:1, house:[[[1,2],[3,4]],[1]]} as any as playRequestResource))
// // console.log(flatten({asdf:1, house:[[1,2],[3,4],[[],[]]]} as any as playRequestResource))
// // console.log(flatten({asdf:1, house:[[1,2],[3,4],[],[]]} as any as playRequestResource))
// // //this should be correct
// // console.log(flatten({asdf:1, house:[[1,2],[3,4],[5,6,7,8]]} as playRequestResource))
// // console.log("get this right")
// // console.log(flatten({house:[[1,2],[3,4],[5,6,7,8]]} as playRequestResource))
// // // console.log({asdf:1, discard:[[1,2],[2,3]]} as any as playRequestResource)

// // Object.keys(new playRequestResource()).forEach(x => console.log(x))


function flattenSimple(req:playRequestResource): number[]{//type should be playRequestResource
    let flatCardIds:number[] = [];
    !isNaN(req.discard) ? flatCardIds.push(req.discard) : null;
    req.house ? req.house.forEach(x => flatCardIds.push(...x)) : null;
    req.sapaw ? req.sapaw.forEach(x => flatCardIds.push(...x.cardId)) : null;
    return flatCardIds.filter(x => !isNaN(x) && x > 0);
}

console.log(flattenSimple({}))
//empty playRequestResource
console.log(flattenSimple({} as playRequestResource))
//extra property and wrong key name
console.log(flattenSimple({asdf:1, discards:[[1,2],[2,3]]} as playRequestResource))
//xtra prop, right name, wrong value type
console.log(flattenSimple({asdf:1, discard:[[1,2],[2,3]]} as any as playRequestResource))
console.log(flattenSimple({asdf:1, discard:[["asdf",2],[2,3]]} as any as playRequestResource))
console.log(flattenSimple({asdf:1, discard:[1]} as any as playRequestResource))
console.log(flattenSimple({asdf:1, house:[[[1,2],[3,4]],[1]]} as any as playRequestResource))
console.log(flattenSimple({asdf:1, house:[[1,2],[3,4],[[],[]]]} as any as playRequestResource))
console.log(flattenSimple({asdf:1, house:[[1,2],[3,4],[],[]]} as any as playRequestResource))
//this should be correct
console.log(flattenSimple({asdf:1, house:[[1,2],[3,4],[5,6,7,8]]} as playRequestResource))
console.log("get this right")
console.log(flattenSimple({sapaw:[{houseId:99,cardId:[1,2]}],discard:1,house:[[1,2],[3,4],[5,6,7,8]]} as playRequestResource))
console.log(flattenSimple({sapaw:[{houseId:99,cardId:[1,2]}],discard:1} as playRequestResource))