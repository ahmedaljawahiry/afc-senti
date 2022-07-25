"""Fast API endpoints"""
import functools
import logging

from starlette.websockets import WebSocketDisconnect

from . import twitter

from fastapi import FastAPI, WebSocket

LOGGER = logging.getLogger(__name__)

app = FastAPI()


async def tweet_to_ws(tweet: twitter.Tweet, websocket: WebSocket):
    """Sends the Tweet text through the Websocket"""
    LOGGER.info(f"Received Tweet: {tweet.id}")
    await websocket.send_text(tweet.text)


@app.websocket("/ws")
async def ws(websocket: WebSocket):
    """Main Websocket endpoint"""
    await websocket.accept()
    await websocket.send_text("LETS GO")

    twitter_client = await twitter.setup_client(
        on_tweet=functools.partial(tweet_to_ws, websocket=websocket)
    )

    stream = twitter_client.filter()

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        LOGGER.info("Cancelling Twitter stream")
        stream.cancel()
