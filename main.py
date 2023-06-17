import requests
import time
import re

URL = "https://engine.freerice.com/games/afc36aae-af05-4c62-87b9-816ebfbe665d/answer"

data = {
    "answer": "c41c4b66-4a08-4bbc-8c14-ece8b9cd264c",
    "question": "f79892cb-6b68-526c-8499-63815d93c41a",
    "user": None,
}

headers = {
    "authority": "engine.freerice.com",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY5NzMzMjQsImV4cCI6MTY4OTM5MjUyNCwiZHJ1cGFsIjp7InVpZCI6IjI3OTIwMjYifSwidXVpZCI6ImM1ZTllZjlhLWMzNGMtNDA4ZC04OGFmLWU0MWI0ZmE4YTczOSJ9.mJig57GZqOPLULoKvEhKFP3dLo-6KLGena2Q9Srm_ZE",
    "origin": "https://play.freerice.com",
}

def sleep(ms):
    time.sleep(ms / 1000)

def extract_numbers(string):
    numbers = re.findall(r"\d+", string)
    if numbers and len(numbers) >= 2:
        first_number = int(numbers[0])
        second_number = int(numbers[1])
        return [first_number, second_number]
    else:
        return None

try_header = True
error_count = 0

def call_server():
    global data, try_header, error_count

    while True:
        try:
            if try_header:
                response = requests.patch(URL, json=data, headers=headers)
            else:
                response = requests.patch(URL, json=data)

            response_data = response.json()
            question_id = response_data["data"]["attributes"]["question_id"]
            data["question"] = question_id

            question_text = response_data["data"]["attributes"]["question"]["text"]
            first_num, second_num = extract_numbers(question_text)
            answer = first_num * second_num

            options = response_data["data"]["attributes"]["question"]["options"]
            for option in options:
                potential_answer = int(option["text"])
                if potential_answer == answer:
                    data["answer"] = option["id"]
                    break

            rice_count = response_data["data"]["attributes"]["rice"]
            print("TOTAL RICE COUNT:", rice_count)

            sleep(1400)
            error_count = 0  # Reset error count if request was successful
        except requests.exceptions.RequestException as error:
            print("Error:", str(error))
            error_count += 1
            if error_count > 5:
                print("Exceeded maximum error count. Quitting program.")
                return
            try_header = not try_header
            sleep(1500)

call_server()