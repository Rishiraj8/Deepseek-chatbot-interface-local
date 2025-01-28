const chatBox = document.getElementById("chat-box")
const chatInput = document.getElementById("chat-input")
const sendButton = document.getElementById("sendButton")

function addMessage(message, isUser) {
  const messageElement = document.createElement("div")
  messageElement.classList.add(isUser ? "user-message" : "bot-message")
  chatBox.appendChild(messageElement)

  if (isUser) {
    messageElement.textContent = message
    scrollToBottom()
  } else {
    typewriterEffect(messageElement, message)
  }
}

function typewriterEffect(element, text, speed = 30) {
  let i = 0
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      scrollToBottom()
    } else {
      clearInterval(timer)
    }
  }, speed)
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight
}

async function sendMessage() {
  const userMessage = chatInput.value.trim()
  if (!userMessage) return

  addMessage(userMessage, true)
  chatInput.value = ""

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await response.json()
    if (response.ok) {
      addMessage(data.response.trim(), false)
    } else {
      addMessage(`Error: ${data.error}`, false)
    }
  } catch (error) {
    addMessage("Error: Unable to connect to server.", false)
  }
}

sendButton.addEventListener("click", sendMessage)
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

// Add a welcome message
window.addEventListener("load", () => {
  setTimeout(() => {
    addMessage("Welcome to the chat! How can I assist you today?", false)
  }, 500)
})

