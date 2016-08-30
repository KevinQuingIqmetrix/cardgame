import {suite} from "./suite";
export class card{
    /**
     *card model
     */
    constructor(
        public id:number,
        public rank: number,
        public suite: suite
    ) {
        
    }
}

