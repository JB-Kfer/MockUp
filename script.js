let allMsgs = [];
let local = "JB"
fetch('https://c16bb5fa-b175-46a5-80ec-6478ce04843d-00-1d31kx18hbryc.worf.replit.dev/msg/getAll')
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    allMsgs = json.msgs;
    update(allMsgs);
  });

async function sendMessage() {
  // Sélectionne la zone de texte pour le message
  const textArea = document.querySelector("textarea");

  // Récupère le message saisi
  const textToSend = textArea.value.trim();

  // Vérifie si le message est vide
  if (textToSend === "") {
    // Affiche un message d'erreur
    alert("Please type a message.");
    return;
  }

  // Efface la zone de texte
  textArea.value = "";
  // Envoie le message au serveur
  try {
    const response = await fetch("https://c16bb5fa-b175-46a5-80ec-6478ce04843d-00-1d31kx18hbryc.worf.replit.dev/msg/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: textToSend, user: local })
    });

    if (response.ok) {
      // Mettre à jour la liste des messages
      allMsgs.push({ content: textToSend, user: local });
      update(allMsgs);
    } else {
      // Afficher un message d'erreur
      alert("Failed to send message. Server responded with status: " + response.status);
    }
  } catch (error) {
    // Afficher un message d'erreur
    console.error(error);
    alert("Failed to send message. Error: " + error.message);
  }
}

function update(newMsgs) {
  if (!newMsgs) {
    return;
  }
  // Sélectionne la liste des messages
  const list = document.getElementById("messageList");

  // Efface la liste des messages
  list.innerHTML = "";

  // Passe au travers du tableau et crée pour chaque élément un nouvel <li> avec la classe appropriée
  for (let i = 0; i < newMsgs.length; i++) {
    const msg = newMsgs[i];
    const li = document.createElement("li");
    if (msg.user === local) {
      // Create a new div element for the message container
      const messageContainer = document.createElement("div");

      // Create a new div element for the username
      const usernameDiv = document.createElement("div");
      usernameDiv.classList.add("message-right-more");

      // Create a new div element for the message left
      const messageRight = document.createElement("div");
      messageRight.classList.add("message-right");
      const message = document.createTextNode(msg.content);
      messageRight.appendChild(message);

      // Append the username div to the message container div
      messageContainer.appendChild(usernameDiv);

      // Append the message left div to the message container div
      messageContainer.appendChild(messageRight);

      // Append the message container to the li element
      li.appendChild(messageContainer);

      // Append the li element to the list
      const ul = document.querySelector("ul"); // or whatever the parent element is
      ul.appendChild(li);
    } else {
      // Create a new div element for the message container
      const messageContainer = document.createElement("div");

      // Create a new div element for the username
      const usernameDiv = document.createElement("div");
      usernameDiv.classList.add("message-left-more");
      const username = document.createTextNode(msg.user);
      usernameDiv.appendChild(username);

      // Create a new div element for the message left
      const messageLeft = document.createElement("div");
      messageLeft.classList.add("message-left");
      const message = document.createTextNode(msg.content);
      messageLeft.appendChild(message);

      // Append the username div to the message container div
      messageContainer.appendChild(usernameDiv);

      // Append the message left div to the message container div
      messageContainer.appendChild(messageLeft);

      // Append the message container to the li element
      li.appendChild(messageContainer);

      // Append the li element to the list
      const ul = document.querySelector("ul"); // or whatever the parent element is
      ul.appendChild(li);


    }
    list.appendChild(li);

    // Ajoute le séparateur de message
    const separator = document.createElement("li");
    separator.classList.add("message-separator");
    list.appendChild(separator);
  }
}