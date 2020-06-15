import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const tasksService = app.get(TaskService);
  const app = await NestFactory.create(AppModule);
  const taskService = app.select(TaskModule).get(TaskService, { strict: true });
}

bootstrap();
