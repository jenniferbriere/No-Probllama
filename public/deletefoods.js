function deleteFood(food_id) {
  $.ajax({
    url: '/foods/' + food_id,
    type: 'DELETE',
    success: function (result) {
      window.location.reload(true);
    }
  })
};

function deleteFeeding(animal_id, food_id) {
  $.ajax({
    url: '/feedings/animal/' + animal_id + '/food/' + food_id,
    type: 'DELETE',
    success: function (result) {
        window.location.reload(true)
    }
  })
};
