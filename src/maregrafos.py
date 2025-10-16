from datetime import datetime, timedelta
import requests

def maregrafos():
    return ['EMBEL', 'EMSAN', 'EMFOR', 'EMSAL', 'EMARC', 'EMIMB']


def get_maregrafo_info():
    URL = f'https://servicodados.ibge.gov.br/api/v1/rmpg/maregrafos'
    info = requests.get(URL)
    yield info.json()
        

