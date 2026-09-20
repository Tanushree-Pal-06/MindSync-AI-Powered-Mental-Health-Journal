import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def ask_ai(messages):

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": messages
        }
    )

    print("STATUS:", response.status_code)
    print("FULL RESPONSE:")
    print(response.text)

    result = response.json()

    if "choices" not in result:
        print(result)
        return "OpenRouter returned an error."

    return result["choices"][0]["message"]["content"]