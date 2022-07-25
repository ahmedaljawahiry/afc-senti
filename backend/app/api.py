import random

from fastapi import FastAPI, WebSocket

app = FastAPI()


@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()

    while True:
        number = random.randint(0, 2000)
        await websocket.send_text(f"{number}")
