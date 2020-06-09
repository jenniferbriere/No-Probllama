  
function updateAnimal(animal_id){
    $.ajax({
        url: '/animals/' + animal_id,
        type: 'PUT',
        data: $('#update-animal').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
