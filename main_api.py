#importa o fastapi
from fastapi import FastAPI

#uvicorn main_api:app --reload
# para rodar no localhost

#python -m uvicorn main_api:app --host 0.0.0.0 --port 80
# para roda no shardecloud

#pega os script feito pelo Coelho
from src.meteorology import *
from src.news import *
from src.sea_level import *

import src.maregrafos as maregrafos

#cria um obj do fastapi
app = FastAPI()

@app.get("/meteorologia/{tempo}")
def meterologia(tempo: float):
    return [*meteorology(tempo)]

@app.get("/noticias/{dias_atras}")
def noticias(dias_atras: int):
    return [*parse_news(dias_atras)]

@app.get("/nivel_do_mar/{tempo}")
def nivel_do_mar(tempo: float):
    return [*sea_level(tempo)]

@app.get("/maregrafo_info")
def get_maregrafo_info():
    return [*maregrafos.get_maregrafo_info()]

@app.get("/")
def home():
    return "vá para /docs ou morra"

