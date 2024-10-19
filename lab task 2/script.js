// script.js
$(document).ready(function() {
  // Fetch and display random dog images
  $('#fetchBtn').click(function() {
    $.ajax({
      url: "https://api.thedogapi.com/v1/images/search",
      method: "GET",
      dataType: "json",
      success: function(data) {
        let dogGallery = $('#dogGallery');
        dogGallery.empty();
        
        $.each(data, function(index, dog) {
          let breedName = dog.breeds && dog.breeds.length > 0 ? dog.breeds[0].name : "Unknown Breed";
          let dogItem = `
            <div class="dog-item" id="dog-${index}">
              <h3 class="breed-name">${breedName}</h3>
              <img src="${dog.url}" alt="Dog Image">
              <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="dog-${index}">Edit</button>
              <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="dog-${index}">Delete</button>
            </div>
          `;
          dogGallery.append(dogItem);
        });

        // Attach click event to delete buttons
        $('.btn-del').click(function() {
          let dogId = $(this).data("id");
          $(`#${dogId}`).remove(); // Directly remove from DOM
        });

        // Attach click event to edit buttons
        $('.btn-edit').click(function() {
          let dogId = $(this).data("id");
          let breedName = $(`#${dogId} .breed-name`).text();
          let newBreedName = prompt("Update Breed Name:", breedName);
          if (newBreedName) {
            $(`#${dogId} .breed-name`).text(newBreedName);
          }
        });
      },
      error: function(error) {
        console.error("Error fetching dog images:", error);
      }
    });
  });

  // Create new dog entry
  $('#createForm').submit(function(event) {
    event.preventDefault();
    let title = $('#createTitle').val();
    let content = $('#createContent').val();
    if (title && content) {
      let newDogItem = `
        <div class="dog-item" id="dog-new">
          <h3 class="breed-name">${title}</h3>
          <p>${content}</p>
          <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="dog-new">Edit</button>
          <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="dog-new">Delete</button>
        </div>
      `;
      $('#dogGallery').append(newDogItem);

      // Clear the form
      $('#createTitle').val('');
      $('#createContent').val('');
      
      // Add event handlers for the new item
      $('.btn-del').last().click(function() {
        let dogId = $(this).data("id");
        $(`#${dogId}`).remove();
      });
      $('.btn-edit').last().click(function() {
        let dogId = $(this).data("id");
        let breedName = $(`#${dogId} .breed-name`).text();
        let newBreedName = prompt("Update Breed Name:", breedName);
        if (newBreedName) {
          $(`#${dogId} .breed-name`).text(newBreedName);
        }
      });
    }
  });

  // Clear form
  $('#clearBtn').click(function(e) {
    e.preventDefault();
    $('#createTitle').val('');
    $('#createContent').val('');
    $(this).hide();
    $('#createBtn').removeAttr('data-id').text('Create');
  });
});
