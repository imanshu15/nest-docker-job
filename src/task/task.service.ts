import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {

    private readonly logger = new Logger(TaskService.name);

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Cron('* * * * * *')
    run() {
        this.logger.debug('Called every 1 seconds');
    }
}
