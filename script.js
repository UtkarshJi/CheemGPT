const API_KEY = '';  // <------- enter your Api key here
const submitButton = document.querySelector('#submit');
const outputElement = document.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const buttonElement = document.querySelector('button');

let historyData = [];

async function getMessage() {
  console.log('clicked');
  const userMessage = inputElement.value;

  if (!userMessage) return; // Exit if the input is empty

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 100
    })
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);
    
    const aiMessage = data.choices[0]?.message?.content || "No response";
    outputElement.textContent = aiMessage;

    if (aiMessage && userMessage) {
      const messageIndex = historyData.length;
      historyData.push({ userMessage, aiResponse: aiMessage });

      const pElement = document.createElement('p');
      pElement.textContent = userMessage;
      pElement.addEventListener('click', () => showResponse(messageIndex));
      historyElement.append(pElement);
    }

    clearInput();
  } catch (error) {
    console.error('Error fetching Groq completion:', error);
  }
}

function showResponse(index) {
  const { aiResponse } = historyData[index];
  outputElement.textContent = aiResponse;
}

function clearInput() {
  inputElement.value = '';
}

submitButton.addEventListener('click', getMessage);
buttonElement.addEventListener('click', clearInput);
