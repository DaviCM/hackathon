#importa o fastapi
from fastapi import FastAPI

#uvicorn main_api:app --reload

#pega os script feito pelo Coelho
from meteorology import meteorology
from news import parse_news
from sea_level import sea_level
from maregrafos import get_maregrafo_info

#cria um obj do fastapi
app = FastAPI()

@app.get("/meterologia/{tempo}")
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
    return [*get_maregrafo_info()]

@app.get("/")
def home():
    return "vá para /docs ou morra"


