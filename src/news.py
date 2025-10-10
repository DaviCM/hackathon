from datetime import datetime, timedelta
import requests
    
    
def parse_news(days_past=15):
    now = datetime.now()
    offset = now - timedelta(days=days_past)
    
    api_key = '33c86fc8d4b44a2cbc8dbd74c071dee7'
    URL = f'https://newsapi.org/v2/everything'
    
    payload = {'q' : '(oceano AND brasil OR atlantico OR marinha OR poluicao OR costa) NOT filme',
               # NewsAPI só aceita tempo em ISO, diferente do formato custom do IBGE
               'from' : f'{offset.isoformat()}', 
               'to' : f'{now.isoformat()}',
               'language' : 'pt',
               'sortBy' : 'relevancy',
               'apiKey' : api_key}

    info = requests.get(URL, params=payload)
    
    for i in range(len(info.json())):
        print(f'{info.json()['articles'][i]} \n')


