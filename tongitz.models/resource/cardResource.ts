import {suiteEnumResource} from "tongitz.models/resource/suiteEnumResource" 

export interface cardResource{
    id: number;
    suite: suiteEnumResource;
    rank: number;
}
