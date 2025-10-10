from datetime import datetime, timedelta
import requests

def maregrafos():
    return ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']


def meteorology(hours_past=0.5):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    format_request = {'pressaoAtm' : 'atmospheric_pressure_hPa',
                'temperaturaExt' : 'temperature_celsius',
                'umidadeExt' : 'humity_percent',
                'direcaoVento' : 'wind_direction_degrees',
                'velocidadeVento' : 'wind_speed_m/s',
                'precipitacao' : 'precipitation_mm'}
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', # Formatar tempo na forma de STR
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '15|30|31|32|33|34'}

    for mrgf in maregrafos():
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/meteorologia/{mrgf}'
        info = requests.get(URL, params=payload)
        format_info = info.json()

        if format_info != []:
            for dictionary in format_info:
                new_datetime = datetime.strptime(dictionary['dtHrLeitura'], '%Y-%m-%d-%H-%M')
                dictionary['datetime_ISO'] = (new_datetime.isoformat()) # Converte a STR de tempo para um objeto datetime no padrão ISO
                del dictionary['dtHrLeitura']
                
                dictionary['mareograph'] = mrgf

                # Items() retorna uma tupla para cada conjunto chave-valor do dict
                for key, new_name in format_request.items():
                    if key in dictionary:
                        dictionary[new_name] = dictionary.pop(key)
                        del key
            yield format_info
        else:
            continue


def sea_level(hours_past=0.5):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', 
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '1|2',
               'incluirPrevisao' : 'S'}
    
    for mrgf in maregrafos():
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/nivel/{mrgf}'
        info = requests.get(URL, params=payload)
        format_info = info.json()

        if (format_info != []) and (type(format_info) != dict):
            for dictionary in format_info:
                new_datetime = datetime.strptime(dictionary['dtHrLeitura'], '%Y-%m-%d-%H-%M')
                dictionary['datetime_ISO'] = (new_datetime.isoformat()) # Converte a STR de tempo para um objeto datetime no padrão ISO
                del dictionary['dtHrLeitura']
                
                dictionary['mareograph'] = mrgf
            yield format_info
        else:
            continue


def repack(func):
    format_info = func()
    
    for readings_list in format_info:
        for reading in readings_list:
            for key in reading:
                print(f'{key} : {reading.get(key)}')
            print('\n')


repack(sea_level)