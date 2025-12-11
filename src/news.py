from datetime import datetime, timedelta
import requests
    
    
def parse_news(days_past=15):
    now = datetime.now()
    offset = now - timedelta(days=days_past)
    
    api_key = ''
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
        yield info.json()['articles'][i]
        
        
