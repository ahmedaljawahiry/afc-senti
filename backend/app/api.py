"""Fast API endpoints"""
import functools
import logging

from starlette.websockets import WebSocketDisconnect

from . import twitter

from fastapi import FastAPI, WebSocket

LOGGER = logging.getLogger(__name__)

app = FastAPI()


def message_info(text: str) -> dict:
    """Creates an info message object, in the correct format"""
    return {"type": "info", "text": text}


def message_tweet(tweet: twitter.Tweet) -> dict:
    """Creates a Tweet message object, in the correct format"""
    return {"type": "tweet", "data": {"tweet": {"text": tweet.text, "id": tweet.id}}}


async def tweet_to_ws(tweet: twitter.Tweet, websocket: WebSocket):
    """Sends the Tweet through the Websocket"""
    LOGGER.info(f"Received Tweet: {tweet.id}")
    await websocket.send_json(message_tweet(tweet))


@app.websocket("/ws")
async def ws(websocket: WebSocket):
    """Main Websocket endpoint"""
    await websocket.accept()
    await websocket.send_json(message_info("Connecting to Twitter..."))

    twitter_client = await twitter.setup_client(
        on_tweet=functools.partial(tweet_to_ws, websocket=websocket)
    )

    stream = twitter_client.filter()
    await websocket.send_json(message_info("Connected to Twitter"))

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        LOGGER.info("Cancelling Twitter stream")
        stream.cancel()
