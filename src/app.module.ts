import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PackagingModule } from './packaging/packaging.module';

@Module({
  imports: [PackagingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
