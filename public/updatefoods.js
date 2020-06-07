function updateFood(food_id) {
    $.ajax({
        url: '/foods/' + food_id,
        type: 'PUT',
        data: $('#updateFoods').serialize(),
        success: function (result) {
            //window.location.replace("./");
            window.location.reload(true);
        }
    })
};
