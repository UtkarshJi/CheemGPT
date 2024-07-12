const API_KEY = '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';
const submitButton = document.querySelector('#submit');
const outputDiv = document.querySelector('#output');
const userInput = document.querySelector('#user-input');
const historyDiv = document.querySelector('.history');

let historyData = [];

async function getMessage() {
  console.log('clicked');
  
  const userMessage = userInput.value;
  if (!userMessage) return; // Exit if the input is empty

  // Add user message to history and save the message index
  const messageIndex = historyData.length;
  addMessageToHistory(userMessage, messageIndex);
  
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

    const messageContent = data.choices[0]?.message?.content || "No response";
    outputDiv.innerText = messageContent;

    // Save AI response in history data
    historyData.push({ userMessage, aiResponse: messageContent });

    console.log(data);
  } catch (error) {
    console.error('Error fetching Groq completion:', error);
  }
}

function addMessageToHistory(message, index) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('history-item');
  messageElement.innerText = message;
  messageElement.dataset.index = index; // Save the index as a data attribute
  messageElement.addEventListener('click', () => showResponse(index));
  historyDiv.appendChild(messageElement);
}

function showResponse(index) {
  const { aiResponse } = historyData[index];
  outputDiv.innerText = aiResponse;
}

submitButton.addEventListener('click', getMessage);
