import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as fs from 'fs';
import * as csv  from 'csv-parser';
import * as ObjectsToCsv from 'objects-to-csv';

@Injectable()
export class TaskService {

    private readonly logger = new Logger(TaskService.name);
    private readonly testFolder = '//FTD-NB-IMANSHU/networkPath';

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    //@Cron('* * * * * *')
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Interval(10000)
    run() {
        try{

            this.createFolders();

            fs.readdir(this.testFolder, (err, files) => {
                if(files && files.length > 0) {
                    const csvFiles = files.filter(a => a.trim().toLowerCase().endsWith('csv'));

                    this.logger.debug(csvFiles);
                    // Need to implement a logic to separate file couples when there is more than two files.
                    this.generateNewCsv(csvFiles[0], csvFiles[1]);
                }
            });
        }catch(err) {
            this.logger.error(err);
        }
    }

    private generateNewCsv(deleteFile: string, newFile: string) {
        this.combineFiles(deleteFile, newFile).then(data => {
            this.logger.debug(`File Combined: ${deleteFile} + ${ newFile }`);

            // generate a new csv file from combined data set     
            this.printCsv(data, newFile);

            this.logger.debug(`File Generated: ${deleteFile} + ${ newFile }`);

            // move already processed two files
            this.moveFile(deleteFile);
            this.moveFile(newFile);

            this.logger.debug(`File Moved: ${deleteFile} + ${ newFile }`);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async printCsv(data: any, fileName: string) {
        await new ObjectsToCsv(data).toDisk(`${this.testFolder}\\Generated\\${fileName}`);
    }

    private combineFiles(deleteFile: string, newFile: string) {
        return new Promise<any>((resolve, reject) => {
            try{
                this.readFile(deleteFile).then(dataOne => {
                    dataOne.forEach(a => a.New = "D");
                    this.readFile(newFile).then(dataTwo => {
                        dataTwo.forEach(a => a.New = "N");
                        resolve([...dataOne, ...dataTwo]);
                    });
                });
            }catch(err){
                reject(null);
            }
        });
    }

    private readFile(file: string): Promise<any[]>{
        return new Promise<any[]>((resolve, reject) => {
            try{
                const results = [];
                fs.createReadStream(`${this.testFolder}\\${file}`)
                .pipe(csv()).on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
            }catch(err){
                reject(null);
            }
        });
    }

    private moveFile(file: string) {
        fs.rename(`${this.testFolder}\\${file}`, `${this.testFolder}\\Processed\\${file}`, err => {
            if (err) throw err
        });
    }

    private createFolders(){
        if (!fs.existsSync(`${this.testFolder}\\Processed`)){
            fs.mkdirSync(`${this.testFolder}\\Processed`);
        }
        if (!fs.existsSync(`${this.testFolder}\\Generated`)){
            fs.mkdirSync(`${this.testFolder}\\Generated`);
        }
    }
}
