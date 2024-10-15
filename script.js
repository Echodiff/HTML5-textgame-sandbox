const rooms = {
  livingRoom: {
    description: "You are in the living room. It's cozy with a large sofa and a fireplace.",
    choices: [
      { text: "Go to the Kitchen", nextRoom: "kitchen" },
      { text: "Go upstairs to the Bedroom", nextRoom: "bedroom" },
      { text: "Enter the Bathroom", nextRoom: "bathroom" },
      { text: "Go down to the Basement", nextRoom: "basement" }
    ],
    image: "Living Room",
    showActionImages: false
  },
  kitchen: {
    description: "You're in the kitchen. It smells like freshly baked cookies.",
    choices: [
      { text: "Return to the Living Room", nextRoom: "livingRoom" }
    ],
    image: "Kitchen",
    showActionImages: false
  },
  bedroom: {
    description: "You're in the bedroom. There's a comfortable-looking bed and a window with a nice view.",
    choices: [
      { text: "Go back downstairs to the Living Room", nextRoom: "livingRoom" },
      { text: "Pick up the key", action: "pickUpKey" }
    ],
    image: "Bedroom",
    showActionImages: true
  },
  bathroom: {
    description: "You're in the bathroom. It's small but clean, with a shower and a mirror.",
    choices: [
      { text: "Go back to the Living Room", nextRoom: "livingRoom" }
    ],
    image: "Bathroom",
    showActionImages: false
  },
  basement: {
    description: "You're in the basement. It's a bit dark and musty down here.",
    choices: [
      { text: "Go back upstairs to the Living Room", nextRoom: "livingRoom" }
    ],
    image: "Basement",
    showActionImages: false
  },
  secretRoom: {
    description: "You've entered a secret room! It's filled with mysterious artifacts and ancient books.",
    choices: [
      { text: "Go back to the Kitchen", nextRoom: "kitchen" }
    ],
    image: "Secret Room",
    showActionImages: false
  }
};

let currentRoom = "livingRoom";
let hasKey = false;

function updateRoom() {
  const room = rooms[currentRoom];
  document.getElementById("room-description").textContent = room.description;
  document.getElementById("room-image").textContent = room.image;
  
  const actionImagesContainer = document.getElementById("action-images-container");
  actionImagesContainer.style.display = room.showActionImages ? "flex" : "none";
  
  const choicesList = document.getElementById("choices");
  choicesList.innerHTML = "";
  
  room.choices.forEach((choice, index) => {
    if (choice.action === "pickUpKey" && hasKey) return; // Skip this choice if key is already picked up
    if (choice.action === "unlockSecretRoom" && !hasKey) return; // Skip this choice if key is not picked up

    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `${index + 1}) ${choice.text}`;
    button.addEventListener("click", () => {
      if (choice.action) {
        handleAction(choice.action);
      } else {
        currentRoom = choice.nextRoom;
      }
      updateRoom();
    });
    li.appendChild(button);
    choicesList.appendChild(li);
  });

  // Update character sprite
  const characterSprite = document.getElementById("character-sprite");
  const characterSprite2 = document.getElementById("character-sprite-2");
  
  if (currentRoom === "basement") {
    characterSprite.style.display = "none";
    characterSprite2.style.display = "flex";
    characterSprite2.textContent = "Character 2";
  } else {
    characterSprite.style.display = "flex";
    characterSprite2.style.display = "none";
    characterSprite.textContent = "Character";
  }

  // Update action images
  const actionImages = document.querySelectorAll(".action-image");
  actionImages.forEach((img, index) => {
    if (currentRoom === "bedroom" && index === 0) {
      img.style.display = "flex";
      img.textContent = "Key";
    } else {
      img.style.display = "none";
    }
  });

  // Update kitchen choices based on key possession
  if (currentRoom === "kitchen") {
    if (hasKey) {
      const secretRoomChoice = rooms.kitchen.choices.find(choice => choice.action === "unlockSecretRoom");
      if (secretRoomChoice) {
        secretRoomChoice.text = "Enter the Secret Room";
        secretRoomChoice.nextRoom = "secretRoom";
        delete secretRoomChoice.action;
      } else {
        rooms.kitchen.choices.push({ text: "Unlock the Secret Room", action: "unlockSecretRoom" });
      }
    }
  }
}

function handleAction(action) {
  switch (action) {
    case "pickUpKey":
      hasKey = true;
      rooms.bedroom.choices = rooms.bedroom.choices.filter(choice => choice.action !== "pickUpKey");
      rooms.kitchen.choices.push({ text: "Unlock the Secret Room", action: "unlockSecretRoom" });
      alert("You picked up the key!");
      break;
    case "unlockSecretRoom":
      rooms.kitchen.choices = rooms.kitchen.choices.filter(choice => choice.action !== "unlockSecretRoom");
      rooms.kitchen.choices.push({ text: "Enter the Secret Room", nextRoom: "secretRoom" });
      alert("You unlocked the secret room!");
      break;
  }
}

document.addEventListener("DOMContentLoaded", updateRoom);