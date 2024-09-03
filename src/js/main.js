/* Nav bar */

const nav = document.querySelector("nav");
const mobileNav = document.querySelector("nav.mobile-nav");
const menuIcon = document.querySelector(".menu-icon");
const closeIcon = document.querySelector(".mobile-menu-container .close-icon");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 60) {
    nav.classList.add("scrolled");
    mobileNav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
    mobileNav.classList.remove("scrolled");
  }
});

menuIcon.addEventListener("click", () => {
  mobileMenuContainer.classList.add("active");
});

closeIcon.addEventListener("click", () => {
  mobileMenuContainer.classList.remove("active");
});

/* Survey */

document.addEventListener('DOMContentLoaded', function() {
  // Check if the current page is the survey page
  var isSurveyPage = document.body.classList.contains('survey-page');
  var submitButton = document.getElementById('submitButton');
  console.log("Submit button:", submitButton);

  if (isSurveyPage) {
    const ul_1 = document.querySelector(".option1");
    const ul_2 = document.querySelector(".option2");
    const ul_3 = document.querySelector(".option3");
    const ul_4 = document.querySelector(".option4");
    const ul_5 = document.querySelector(".option5");
    const ul_6 = document.querySelector(".option6");
    const ul_7 = document.querySelector(".option7");
    const ul_8 = document.querySelector(".option8");
    const ul_9 = document.querySelector(".option9");
    const ul_10 = document.querySelector(".option10");

    const q1 = document.querySelector(".q1");
    const q2 = document.querySelector(".q2");
    const q3 = document.querySelector(".q3");
    const q4 = document.querySelector(".q4");
    const q5 = document.querySelector(".q5");
    const q6 = document.querySelector(".q6");
    const q7 = document.querySelector(".q7");
    const q8 = document.querySelector(".q8");
    const q9 = document.querySelector(".q9");
    const q10 = document.querySelector(".q10");

    const survey = document.querySelector(".survey");
    const end = document.querySelector(".end");

    // questions
    ul_1.addEventListener("click", function() {
      q1.style.display = "none";
      q2.style.display = "block";
    });

    ul_2.addEventListener("click", function() {
      q2.style.display = "none";
      q3.style.display = "block";
    });

    ul_3.addEventListener("click", function() {
      q3.style.display = "none";
      q4.style.display = "block";
    });

    ul_4.addEventListener("click", function() {
      q4.style.display = "none";
      q5.style.display = "block";
    });

    ul_5.addEventListener("click", function() {
      q5.style.display = "none";
      q6.style.display = "block";
    });

    ul_6.addEventListener("click", function() {
      q6.style.display = "none";
      q7.style.display = "block";
    });

    ul_7.addEventListener("click", function() {
      q7.style.display = "none";
      q8.style.display = "block";
    });

    ul_8.addEventListener("click", function() {
      q8.style.display = "none";
      q9.style.display = "block";
    });

    ul_9.addEventListener("click", function() {
      q9.style.display = "none";
      q10.style.display = "block";
    });

    ul_10.addEventListener("click", function() {
      q10.style.display = "none";
      end.style.display = "block";
    });

    //Submit data and redirect to chatbot

    if (submitButton) {
      submitButton.addEventListener('click', function() {
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var email = document.getElementById('email').value;
        var occupation = document.getElementById('occupation').value;
        
        // Construct a message to send to the chatbot
        var message = `Hello! My name is ${firstName} ${lastName}, and I am a ${occupation}. You can contact me at ${email}.`;
      
        // Store the message in localStorage
        localStorage.setItem('userMessage', message);
        
        // Redirect to the chatbot page
        window.location.href = 'chatbot.html';
      });
  } else {
    console.error("Submit button not found!");
  }
}
});

// Testimonials

document.addEventListener('DOMContentLoaded', function() {
  // Check if the current page is the testimonials page
  var isTestimonialsPage = document.body.classList.contains('testimonials-page');

  if (isTestimonialsPage) {
    var swiper = new Swiper(".testimonial", {
      slidesPerView: 1,
      grabCursor: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
});




// CHATBOT
document.addEventListener('DOMContentLoaded', function () {
  // Check if the current page is the chatbot page
  var isChatbotPage = document.body.classList.contains('chatbot-page');

  // Execute the chatbot code only if it's the chatbot page
  if (isChatbotPage) {
    try {
      const form = document.getElementById("chat-form");
      const input = document.getElementById("chat-input");
      const messages = document.getElementById("chat-messages");
      const apiKey = "<API_KEY_HERE>";
      // Please don't steal i'm poor

      const sendMessage = async (message, isUser = true) => {
        const messageClass = isUser ? 'user-message' : 'bot-message';
        const imageSrc = isUser ? 'media/woman_profile_at_dawn.jpg' : 'media/max-vs-PjCh5goo-unsplash.jpg';
        const altText = isUser ? 'user icon' : 'bot icon';

        messages.innerHTML += `<div class="message ${messageClass}">
          <img src="${imageSrc}" alt="${altText}"> <span>${message}</span>
        </div>`;

        if (isUser) {
          try {
            const response = await axios.post(
              "https://api.openai.com/v1/completions",
              {
                prompt: message,
                model: "text-davinci-003",
                temperature: 0,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            );
            const chatbotResponse = response.data.choices[0].text.trim();

            if (chatbotResponse) {
              sendMessage(chatbotResponse, false);
            }
          } catch (error) {
            console.error("Error in API request:", error);
            messages.innerHTML += `<div class="message bot-message">
              <span>Oops! Something went wrong on our end. Please try again.</span>
            </div>`;
          }
        }
      };

      // Retrieve user's information from localStorage and send as a message
      const storedMessage = localStorage.getItem('userMessage');
      if (storedMessage) {
        // Add additional instructions or context here
        const additionalInstructions = "You are a chatbot that provides wellness advice for busy professionals. Please introduce yourself and ask the user some questions regarding their work and what wellness activties they may be interested in. After they respond please give them some advice based on their answers";
        const initialMessage = `${additionalInstructions}\n\n${storedMessage}`;
        
        // Send the initial message to the chatbot without displaying it
        sendMessage(initialMessage, true, false);
        localStorage.removeItem('userMessage'); // clear the message after sending
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        input.value = "";

        if (message) {
          sendMessage(message);
        }
      });
    } catch (error) {
      console.error("Error in chatbot setup:", error);
      messages.innerHTML += `<div class="message bot-message">
        <span>Oops! Something went wrong on our end. Please try again.</span>
      </div>`;
    }
  }
});

