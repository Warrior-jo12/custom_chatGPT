import bot from './assets/bot.svg';
import user from './assets/user.svg';
import {X_RapidAPI_Key} from '../API_KEY/key'


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInteraval;

function loader(element){
  element.textContent = '';

  loadInteraval = setInterval(()=>{
    element.textContent += '.';
    if(element.textContent === '...'){
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text){
  let index =0;
  let interval = setInterval(()=>{
    if(index<text.length){
      element.innerHTML += text.charAt(index);
      index ++ ;
    } else {
      clearInterval(interval)
    }
  }, 1)
}

function  generationUniqueID(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId){
  return (
    `<div class="wrapper ${isAi&&'ai'}">
      <div class="chat">
        <div class ="profile">
          <img
            src="${isAi ? bot :user}"
            alt="${isAi ? 'bot' : 'user'}"
            />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
          </div>
        </div>
    `
  )
}

const handleSubmit = async(e)=>{
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  const uniqueId = generationUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch('https://you-chat-gpt.p.rapidapi.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': X_RapidAPI_Key,
    'X-RapidAPI-Host': 'you-chat-gpt.p.rapidapi.com'
    },
    body: JSON.stringify({
      question: data.get('prompt'),
      max_response_time:120
    })
  })

  clearInterval(loadInteraval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.answer;
    console.log(parsedData) 
    typeText(messageDiv, parsedData)
  }else{
    const err = await response.text();
    messageDiv.innerHTML = " something went Wrong";

    alert(err);
  }


}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode ===13){
    handleSubmit(e);
  }
})