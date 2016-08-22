declare var require: any;
//3rd party
const writeFiles = require('write-files');

export interface ITongitzService {}
export class TongitzService {
    save(id:number, json: string) {
        let filename = `${id}.txt`
        let filejson = `{"${filename}":"${json}"}`;
        let file = JSON.parse(filejson)

        writeFiles(file, err => {
            if(err) {
                console.log(err);
                throw err;
            }
        })
    }
}