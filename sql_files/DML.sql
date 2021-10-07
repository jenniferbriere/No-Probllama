--
-- Data Manipulation Queries for No Probllama! Database
-- CS 340 Spring 2020 Section 400
-- Jennifer Briere and Jordan Colbeth
--

-- SPECIES
-- **select all animals of a species
SELECT species_id, species_name FROM species;

-- **add a new species
INSERT INTO species (species_name)
VALUES (:species_name_Input);

-- ANIMALS

-- **add a new animal
INSERT INTO animals (name, species_id)
VALUES (:nameInput, :species_id_from_dropdown_Input);

-- **search for an animal by name (display an individual’s info)
SELECT animals.animal_id, animals.name, species.species_name, active FROM animals 
INNER JOIN species ON animals.species_id = species.species_id 
WHERE animals.name LIKE :nameInput;

-- **search for an animal by species (display a species’ info)
SELECT animals.animal_id, animals.name, species.species_name, active FROM animals 
INNER JOIN species ON animals.species_id = species.species_id 
WHERE animals.species_id = :species_id_Input;

-- **search for specific animal to update
SELECT animals.animal_id AS animal_id, animals.name, species.species_name, active FROM animals 
INNER JOIN species ON animals.species_id = species.species_id
WHERE animal_id = :animal_id_Input

-- **display all animals
SELECT animals.animal_id, animals.name, species.species_id, species.species_name, animals.active FROM animals 
LEFT JOIN species ON animals.species_id = species.species_id;

-- **update active attribute
UPDATE animals SET active = :active_status_Input WHERE animal_id = :animal_id_Input;


-- FOODS

-- **add a new food
INSERT INTO foods (food_type, inventory)
VALUES (:foodTypeInput, :inventoryInput);

-- **update amount of food
UPDATE foods SET inventory = :newInventoryInput
WHERE food_id = :food_id_input;

-- **delete food
DELETE FROM foods WHERE food_id = :food_id_input;

-- **display all food types in inventory
SELECT food_id, food_type FROM foods;

-- **display all food and amount in inventory
SELECT food_id, food_type, inventory FROM foods;

-- **select individual food type for updating
SELECT food_id, food_type, inventory FROM foods 
WHERE food_id = :food_id_input;


-- ANIMALS_FOODS

-- **add an animal/food record
INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day)
VALUES (:animal_id_from_dropdown_Input, :food_id_from_dropdown_Input, :amountInput, :x_per_day_Input);

-- **display all feedings (animal/food pairs)
SELECT animals.animal_id, foods.food_id, animals.name, species.species_name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals 
INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id 
INNER JOIN foods on foods.food_id = animals_foods.food_id 
INNER JOIN species on animals.species_id = species.species_id 
ORDER BY name ASC;

-- **display one feeding record for the purpose of updating
SELECT animals.animal_id, foods.food_id, animals.name, species.species_name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals 
INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id 
INNER JOIN foods on foods.food_id = animals_foods.food_id 
INNER JOIN species on animals.species_id = species.species_id 
WHERE animals_foods.animal_id = :animal_id_Input AND animals_foods.food_id = :food_id_Input;

-- **delete an animal/food record (M:M)
DELETE FROM animals_foods WHERE animal_id = :animal_id_Input and food_id = :food_id_Input;

-- **update amount and/or frequency in animal/food record
UPDATE animals_foods SET amount = :amount_Input, x_per_day = :x_per_day_Input WHERE animal_id = :animal_id_Input AND food_id = :food_id_Input;

-- **search for diets by animal name
SELECT SELECT animals.animal_id, foods.food_id, animals.name, species.species_name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals 
INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id 
INNER JOIN foods on foods.food_id = animals_foods.food_id 
INNER JOIN species on animals.species_id = species.species_id 
WHERE animals.name LIKE = :animal_name_Input;


--SPONSORS

-- **select all sponsors for add sponsorship dropdown
SELECT sponsor_id, first_name, last_name FROM sponsors;

-- **add a sponsor
INSERT INTO sponsors (first_name, last_name, phone_number, email)
VALUES (:first_name_Input, :last_name_Input, :phone_number_Input, :emailInput);


-- SPONSORSHIPS

-- **add a sponsorship
INSERT INTO sponsorships (sponsor_id, date_of_sponsorship, animal_id, amount)
VALUES (:sponsor_id_from_dropdown_Input, CURDATE(), :animal_id_from_dropdown_Input, :amountInput);

-- **display top sponsorships
SELECT CONCAT(s.first_name,' ',s.last_name) AS sponsor_name, animals.name, species.species_name, sponsorships.amount FROM sponsors s 
INNER JOIN sponsorships ON s.sponsor_id = sponsorships.sponsor_id 
INNER JOIN animals ON  sponsorships.animal_id = animals.animal_id 
INNER JOIN species ON animals.species_id = species.species_id  
ORDER BY sponsorships.amount 
DESC LIMIT 15;

