function filterAnimalsBySpecies() {
    //get the id of the selected species from the filter dropdown
    var species_id = document.getElementById('species_filter').value
    //construct the URL and redirect to it
    window.location = '/animals/filter/' + parseInt(species_id)
}