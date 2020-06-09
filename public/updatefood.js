function updateFood(food_id) {
    $.ajax({
        url: '/foods/' + food_id,
        type: 'PUT',
        data: $('#update-food').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};
