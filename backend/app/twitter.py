"""Functionality for fetching Tweets"""
import logging
import os
from typing import Callable, Awaitable

from tweepy import StreamRule, Tweet
from tweepy.asynchronous import AsyncStreamingClient

LOGGER = logging.getLogger(__name__)

RULE_VALUE = "arteta lang:en -is:retweet"
RULE_TAG = "arteta tweets"

STREAMING_RULES = [StreamRule(value=RULE_VALUE, tag=RULE_TAG)]


class _AsyncStreamingClient(AsyncStreamingClient):
    """Extends AsyncStreamingClient to accept function, to be invoked for every new tweet"""

    def __init__(self, *args, on_tweet: Callable[[Tweet], Awaitable[None]], **kwargs):
        super().__init__(*args, **kwargs)
        self._on_tweet = on_tweet

    async def on_tweet(self, tweet: Tweet):
        """Invokes the on_tweet against the instance"""
        return await self._on_tweet(tweet)


async def setup_client(
    on_tweet: Callable[[Tweet], Awaitable[None]], token=None
) -> AsyncStreamingClient:
    """Returns a streaming client for Twitter, with the correct rules setup.

    Args:
        on_tweet: Async function invoked for every new Tweet.
        token: Bearer token, defaults to TWITTER_BEARER_TOKEN env variable."""
    _token = token or os.environ.get("TWITTER_BEARER_TOKEN")
    if not _token:
        raise ValueError("No bearer token set")

    LOGGER.info("Connecting to Twitter...")
    client = _AsyncStreamingClient(bearer_token=_token, on_tweet=on_tweet)

    rules = (await client.get_rules()).data
    if len(rules) != 1 or (len(rules) == 1 and rules[0].tag != RULE_TAG):
        LOGGER.info("Twitter client has incorrect rules set")
        ids = [rule.id for rule in rules]
        if ids:
            LOGGER.warning("Resetting Twitter client rules")
            await client.delete_rules(ids)

        LOGGER.info(f"Creating {len(STREAMING_RULES)} Twitter client rules")
        await client.add_rules(STREAMING_RULES)
    else:
        LOGGER.info("Twitter client has correct rules set")

    return client
