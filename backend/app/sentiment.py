"""Functionality for analysing text sentiment"""
from nltk.sentiment import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()


def score(text: str) -> dict:
    """Returns a dict of polarity scores (neg, neu, pos, compound) for the given text.

    VADER: https://github.com/cjhutto/vaderSentiment"""
    return sia.polarity_scores(text)
