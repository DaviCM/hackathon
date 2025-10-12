from datetime import datetime, timedelta
import requests
from src.maregrafos import maregrafos

def sea_level(hours_past=0.5):
    now = datetime.now()
    offset = now - timedelta(hours=hours_past)
    
    #necesario para não quebra no servidor
    momentoInicial = (offset).strftime('%Y-%m-%d-%H-%M')
    momentoFinal = (now).strftime('%Y-%m-%d-%H-%M')

    payload = {'momentoInicial' : momentoInicial, 
               'momentoFinal' : momentoFinal,
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
        
