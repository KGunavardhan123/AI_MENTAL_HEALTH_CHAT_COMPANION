from flask import Flask, request, jsonify
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    message = data.get("message", "")

    # TextBlob polarity
    blob = TextBlob(message)
    polarity = blob.sentiment.polarity

    # Vader compound score
    vader_score = analyzer.polarity_scores(message)["compound"]

    # Emotion classification
    if vader_score > 0.3:
        emotion = "happy"
        reply = "I'm glad to hear that! Keep holding on to the positives in your life. 🌟"
    elif vader_score < -0.3:
        emotion = "sad"
        reply = "I hear you. It’s okay to feel sad sometimes. Remember, you’re not alone. 💙"
    else:
        emotion = "neutral"
        reply = "Thanks for sharing. I’m here with you whenever you want to talk."

    return jsonify({"reply": reply, "emotion": emotion})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
