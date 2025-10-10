from datetime import datetime, timedelta
import requests

def meteorology(hours_past=0.2):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', 
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '15|30|31|32|33|34'}

    for mrgf in ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']:
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/meteorologia/{mrgf}'
        info = requests.get(URL, params=payload)
        format_info = info.json()

        if format_info != []:
            yield format_info
        else:
            continue


def sea_level(hours_past=0.2):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', 
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '1|2',
               'incluirPrevisao' : 'S'}
    
    for mrgf in ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']:
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/nivel/{mrgf}'
        info = requests.get(URL, params=payload)
        format_info = info.json()

        if (format_info != []) and (type(format_info) != dict):
            for dictionary in format_info:
                dictionary['maregrafo'] = mrgf
            yield format_info
        else:
            continue


def repack_meteorology(format_info=meteorology()):
    for readings_list in format_info:
        for reading in readings_list:
            for key in reading:
                print(f'{key} : {reading.get(key)}')
            print('\n')


repack_meteorology()