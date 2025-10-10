from datetime import datetime, timedelta
import requests

def meteorology(hours_past=1):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', 
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '15|30|31|32|33|34'}

    for mrgf in ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']:
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/meteorologia/{mrgf}'
        info = requests.get(URL, params=payload)

        if info.json() != []:
            print(f'\n -------- {mrgf} -------- \n')

            for i in range(len(info.json())):
                print(info.json()[i])


def sea_level(hours_past=1):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    payload = {'momentoInicial' : f'{(offset).strftime('%Y-%m-%d-%H-%M')}', 
               'momentoFinal' : f'{(now).strftime('%Y-%m-%d-%H-%M')}',
               'codigoSensor' : '1|2',
               'incluirPrevisao' : 'S'}
    
    for mrgf in ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']:
        URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/nivel/{mrgf}'
        info = requests.get(URL, params=payload)

        if (info.json() != []) and (type(info.json()) != dict):
            print(f'\n -------- {mrgf} -------- \n')

            for i in range(len(info.json())):
                print(info.json()[i])


