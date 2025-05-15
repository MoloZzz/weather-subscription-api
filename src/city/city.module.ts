import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { OpenWeatherModule } from 'src/integrations/open-weather/open-weather.module';
import { CityEntity } from 'src/common/entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CityEntity]), OpenWeatherModule],
    providers: [CityService],
    exports: [CityService],
})
export class CityModule {}
