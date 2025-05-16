import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from 'src/common/entities/city.entity';
import { IWeatherLocationResponse } from 'src/common/interfaces';
import { OpenWeatherService } from 'src/integrations/open-weather/open-weather.service';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>,
        private readonly openWeatherService: OpenWeatherService,
    ) {}

    async findOrCreateByName(name: string): Promise<CityEntity> {
        const existing = await this.cityRepository.findOne({ where: { name } });

        if (existing) return existing;

        const geodata: IWeatherLocationResponse[] = await this.openWeatherService.getGeocodingDataByCity(name);
        if (!geodata?.length) {
            throw new NotFoundException(`City '${name}' not found in OpenWeather`);
        }

        const { name: realName, lat, lon } = geodata[0];

        const city = this.cityRepository.create({
            name,
            lat,
            lon,
        });

        return await this.cityRepository.save(city);
    }
}
