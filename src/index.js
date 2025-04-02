let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
// src/index.js

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  const toyForm = document.querySelector('.add-toy-form');
  const baseUrl = 'http://localhost:3000/toys';
  let addToy = false;

  // Show/hide form (provided functionality)
  addToyBtn.addEventListener('click', () => {
      addToy = !addToy;
      toyFormContainer.style.display = addToy ? 'block' : 'none';
  });

  // Fetch and render all toys
  function fetchToys() {
      fetch(baseUrl)
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => renderToy(toy));
          })
          .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToy(toy) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" alt="${toy.name}" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      // Add like button event listener
      const likeBtn = card.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => increaseLikes(toy));

      toyCollection.appendChild(card);
  }

  // Add new toy
  toyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = toyForm.querySelector('input[name="name"]').value;
      const image = toyForm.querySelector('input[name="image"]').value;

      const newToy = {
          name,
          image,
          likes: 0
      };

      fetch(baseUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => {
          renderToy(toy);
          toyForm.reset();
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Increase toy likes
  function increaseLikes(toy) {
      const newLikes = toy.likes + 1;

      fetch(`${baseUrl}/${toy.id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              likes: newLikes
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          // Update DOM
          const card = document.getElementById(updatedToy.id).parentElement;
          const likesP = card.querySelector('p');
          likesP.textContent = `${updatedToy.likes} Likes`;
          toy.likes = updatedToy.likes; // Update local toy object
      })
      .catch(error => console.error('Error updating likes:', error));
  }

  // Initialize the application
  fetchToys();
});