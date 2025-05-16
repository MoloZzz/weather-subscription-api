import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import config from '../../../config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { temperatureUnits } from 'src/common/enums';
import { IWeatherDataResponse, IWeatherLocationResponse } from 'src/common/interfaces';

const openWeatherConfig = config().openApiIntegration;

@Injectable()
export class OpenWeatherService {
    private readonly indexURL: string;
    private readonly apiKey: string;
    private readonly lang: string;

    constructor(private readonly httpService: HttpService) {
        this.indexURL = openWeatherConfig.url;
        this.apiKey = openWeatherConfig.apiKey;
        this.lang = openWeatherConfig.language;
    }

    public async getWeatherDataByCoordinates(latitude: string, longitude: string): Promise<IWeatherDataResponse> {
        console.log('in OpenWeatherService.getWeatherDataByCoordinates');
        try {
            const params = new URLSearchParams({
                lat: latitude,
                lon: longitude,
                units: temperatureUnits.metric,
                lang: this.lang,
                appid: this.apiKey,
            });

            const url: string = `${this.indexURL}/data/2.5/weather?${params.toString()}`;
            const res: AxiosResponse<IWeatherDataResponse> = await this.httpService.axiosRef.get<IWeatherDataResponse>(url);

            return res.data;
        } catch (error) {
            console.error('Error OpenWeatherService.getWeatherDataByCoordinates:', error);
            throw new HttpException('Failed to fetch weather data', HttpStatus.BAD_GATEWAY);
        }
    }

    /**q - City name, state code (only for the US) and country code divided by comma. Please use ISO 3166 country codes.*/
    public async getGeocodingDataByCity(city: string): Promise<IWeatherLocationResponse[]> {
        console.log('in OpenWeatherService.getGeocodingDataByCity');
        try {
            const params = new URLSearchParams({
                q: city,
                appid: this.apiKey,
            });

            const url: string = `${this.indexURL}/geo/1.0/direct?${params.toString()}`;
            const res: AxiosResponse<IWeatherLocationResponse[]> =
                await this.httpService.axiosRef.get<IWeatherLocationResponse[]>(url);
            return res.data;
        } catch (error) {
            console.error('Error OpenWeatherService.getGeocodingDataByCity:', error);
            throw new HttpException('Failed to fetch coordinates by city', HttpStatus.BAD_GATEWAY);
        }
    }
}
