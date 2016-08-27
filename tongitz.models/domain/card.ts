import {suite} from "tongitz.models/domain/suite";
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

