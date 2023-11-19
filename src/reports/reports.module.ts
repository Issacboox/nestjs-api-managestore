import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Reports } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Reports]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
