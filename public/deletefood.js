// more to come...
function deleteFood(id){
    $.ajax({
        url: '/foods/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteFeeding(animal_id, food_id){
  $.ajax({
      url: '/feedings/animal/' + animal_id + '/food/' + food_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
