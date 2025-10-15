#importa o fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#uvicorn main_api:app --reload
# para rodar no localhost

#uvicorn main_api:app --host 0.0.0.0 --port 80
# para roda no shardecloud

#pega os script feito pelo Coelho
from src.meteorology import *
from src.news import *
from src.sea_level import *

import src.maregrafos as maregrafos

#cria um obj do fastapi
app = FastAPI()

#Middleware CORS -> facilita arequisição no js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/meterologia/{tempo}")
def meterologia(tempo: float):
    return {"result": [*meteorology(tempo)]}

@app.get("/noticias/{dias_atras}")
def noticias(dias_atras: int):
    return {"result": [*parse_news(dias_atras)]}

@app.get("/nivel_do_mar/{tempo}")
def nivel_do_mar(tempo: float):
    return {"result": [*sea_level(tempo)]}

@app.get("/maregrafo_info")
def get_maregrafo_info():
    return {"result": [*maregrafos.get_maregrafo_info()]}

@app.get("/")
def home():
    return "vá para https://mocate2ds.shardweb.app/docs ou morra"

