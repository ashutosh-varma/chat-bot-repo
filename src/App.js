import React, { useState } from "react";
import ChatBot, { Button, MessagesContext } from "react-chatbotify";

function App() {

  const [form, setForm] = useState({});
  const [messages, setMessages] = useState([]);

  const flow = {
    start: {
      message: "Hello there! What is your name?",
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_age"
    },
    ask_age: {
      message: (params) => `Nice to meet you ${params.userInput}, what is your age?`,
      function: (params) => setForm({ ...form, age: params.userInput }),
      path: async (params) => {
        if (isNaN(Number(params.userInput))) {
          await params.injectMessage("Age needs to be a number!");
          return;
        }
        return "ask_pet";
      }
    },
    ask_pet: {
      message: "Do you own any pets?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (params) => setForm({ ...form, pet_ownership: params.userInput }),
      path: "ask_choice"
    },
    ask_choice: {
      message: "Select at least 2 and at most 4 pets that you are comfortable to work with:",
      checkboxes: { items: ["Dog", "Cat", "Rabbit", "Hamster", "Bird"], min: 2, max: 4 },
      chatDisabled: true,
      function: (params) => setForm({ ...form, pet_choices: params.userInput }),
      path: "ask_work_days"
    },
    ask_work_days: {
      message: "How many days can you work per week?",
      function: (params) => setForm({ ...form, num_work_days: params.userInput }),
      path: async (params) => {
        if (isNaN(Number(params.userInput))) {
          await params.injectMessage("Number of work day(s) need to be a number!");
          return;
        }
        return "end";
      }
    },
    end: {
      message: "Thank you for your interest, we will get back to you shortly!",
      component: (
        <div className="formStyle">
          <p>Name: {form.name}</p>
          <p>Age: {form.age}</p>
          <p>Pet Ownership: {form.pet_ownership}</p>
          <p>Pet Choices: {form.pet_choices}</p>
          <p>Num Work Days: {form.num_work_days}</p>
        </div>
      ),
      options: ["New Application"],
      chatDisabled: true,
      path: "start"
    },
  }
  
  return (
    <div className="App">
      <MessagesContext.Provider value={{ messages: messages, setMessages: setMessages }}>
        <ChatBot
          settings={{
            general: { embedded: false },
            header: {
              title: 'prama.ai',
              avatar: 'https://picsum.photos/200/300',
              closeChatIcon: 'https://w7.pngwing.com/pngs/512/877/png-transparent-close-exit-stop-button-icon.png'
            },
            chatHistory: { storageKey: "conversations_summary" },
            notification: { disabled: true },
            footer: {
              text: (
                <div style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", columnGap: 3 }}
                  onClick={() => window.open("https://prama.ai/")}
                >
                  <span key={0}>Powered By </span>
                  <img key={1} style={{
                    borderRadius: "50%",
                    width: 14, height: 14, backgroundImage: `url(https://picsum.photos/200/300),
                                linear-gradient(to right, #42b0c5, #491d8d)`
                  }}>
                  </img>
                  <span key={2} style={{ fontWeight: "bold" }}> Prama.ai</span>
                </div>
              ),
              buttons: [Button.EMOJI_PICKER_BUTTON]
            },
            chatHistory: { disabled: true },
            advance: {
              useAdvancedMessages: true
            }
          }}
          flow={flow}
        />
      </MessagesContext.Provider>

    </div>
  );
}

export default App;
