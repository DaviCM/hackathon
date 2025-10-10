import json
import requests

payload = {'momentoInicial' : '2025-10-01-11-00', 
           'momentoFinal' : '2025-10-01-12-00',
           'codigoSensor' : '15|30|31|32|33|34'}

for mrgf in ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']:
    URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/meteorologia/{mrgf}'
    seaLevel = requests.get(URL, params=payload)

    if seaLevel.json() != []:
        print(f'\n -------- {mrgf} -------- \n')

        for i in range(len(seaLevel.json())):
            print(seaLevel.json()[i])
