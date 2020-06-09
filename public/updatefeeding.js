function updateFeeding(animal_id, food_id) {
    $.ajax({
        url: '/feedings/animal/' + animal_id + '/food/' + food_id,
        type: 'PUT',
        data: $('#update-feeding').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};