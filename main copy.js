import axios from "axios";

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
const URL = "https://engine.freerice.com/games/01e1fa83-b66b-4b00-9500-0ed6db69a47a/answer";

async function getRice() {
  console.log("Requesting UN server");
  await callServer();
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

let data = {
  answer: "67af041c-3bfc-496a-81cf-37d8c28bc639",
  question: "bd86fd3b-43b6-516e-b882-d3160dfeb964",
  user: null,
};

let header = {
  authority: "engine.freerice.com",
  authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY5MDY5MDgsImV4cCI6MTY4OTMyNjEwOCwiZHJ1cGFsIjp7InVpZCI6IjI3OTE3NjgifSwidXVpZCI6IjRjMGM1YWQzLWY4NWMtNGQ2My05ZZmLTM1ODdhNDdiYzg1YSJ9.C26V1NTs9-gjJYmLurhumyVaCNulR-xJG5cxhA1fymY",
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

      const attributes = response.data.data;
      data.question = response.quesiton_id;
      data.answer = response.data.data.attributes.question.options[0].id;
      console.log("TOTAL RICE COUNT: ", response.data.data.attributes.rice);
    } catch (error) {
      console.error("Error:", error.message);
      tryHeader = !tryHeader;
    }
  }
}

getRice();
