import axios from "axios";

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
const URL = "https://engine.freerice.com/games/afc36aae-af05-4c62-87b9-816ebfbe665d/answer";

async function getRice() {
  console.log("Requesting UN server");
  await callServer();
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function extractNumbers(string) {
  const numbers = string.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    const firstNumber = parseInt(numbers[0]);
    const secondNumber = parseInt(numbers[1]);
    return [firstNumber, secondNumber];
  } else {
    return null;
  }
}

let data = {
  answer: "c41c4b66-4a08-4bbc-8c14-ece8b9cd264c",
  question: "f79892cb-6b68-526c-8499-63815d93c41a",
  user: null,
};

let header = {
  authority: "engine.freerice.com",
  authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY5NzMzMjQsImV4cCI6MTY4OTM5MjUyNCwiZHJ1cGFsIjp7InVpZCI6IjI3OTIwMjYifSwidXVpZCI6ImM1ZTllZjlhLWMzNGMtNDA4ZC04OGFmLWU0MWI0ZmE4YTczOSJ9.mJig57GZqOPLULoKvEhKFP3dLo-6KLGena2Q9Srm_ZE",
  origin: "https://play.freerice.com",
};
let tryHeader = true;
async function callServer() {
  let response;
  while (true) {
    try {
      if (tryHeader) {
        response = await axios.patch(URL, data);
      } else {
        response = await axios.patch(URL, data, { headers: header });
      }

      data.question = response.quesiton_id;
      const questionText = response.data.data.attributes.question.text;
      const [firstNum, secondNum] = extractNumbers(questionText);
      const answer = firstNum * secondNum;
      for (let x = 0; x < 4; x++) {
        const potentialAnswer = response.data.data.attributes.question.options[x];
        //console.log(questionText, answer, potentialAnswer);
        if (parseInt(potentialAnswer.text) == answer) {
          data.answer = response.data.data.attributes.question.options[x].id;
          break;
        }
      }
      console.log("TOTAL RICE COUNT: ", response.data.data.attributes.rice);
      await sleep(1400);
    } catch (error) {
      console.error("Error:", error.message);
      tryHeader = !tryHeader;
      await sleep(1500);
    }
  }
}

getRice();
