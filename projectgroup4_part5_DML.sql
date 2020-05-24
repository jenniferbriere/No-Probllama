--
-- Data Manipulation Queries for No Probllama! Database
--


-- ANIMALS

-- add a new animal
INSERT INTO animals (name, species_id, birthdate, active)
VALUES (:nameInput, :species_id_from_dropdown_Input, :birthdateInput, :activeInput);

-- add a new species
INSERT INTO species (species_name)
VALUES (:species_name_Input);

-- search for an animal by name (display an individual’s info)
SELECT a.animal_id, a.name, species.species_name, a.birthdate, a.active FROM animals a
INNER JOIN species ON a.species_id = species.species_id
WHERE a.name = :nameInput
ORDER BY a.animal_id ASC;

-- search for an animal by species (display a species’ info)
SELECT a.animal_id, a.name, species.species_name, a.birthdate, a.active FROM animals a
INNER JOIN species ON a.species_id = species.species_id
WHERE species.species_name = :species_name_Input
ORDER BY a.animal_id ASC;


-- display all animals
SELECT a.animal_id, a.name, species.species_name, a.birthdate, a.active FROM animals a
INNER JOIN species ON a.species_id = species.species_id
ORDER BY a.animal_id ASC;


-- FOODS

-- add a new food
INSERT INTO foods (food_type, inventory)
VALUES (:foodTypeInput, :inventory);

-- update amount of food
UPDATE foods SET inventory = :newInventoryInput;

-- delete food
DELETE FROM foods WHERE food_id = :food_id_input;

-- display all foods in inventory
SELECT foods.food_type, foods.inventory FROM foods
ORDER BY foods.food_id ASC;


-- ANIMALS_FOODS

-- add an animal/food record
INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day)
VALUES (:animal_id_from_dropdown_Input, :food_id_from_dropdown_Input, :amountInput, :x_per_day_Input);

-- display all diets
SELECT animals.name, species.species_name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals_foods
JOIN animals ON animals_foods.animal_id = animals.animal_id
JOIN species ON animals.species_id = species.species_id
JOIN foods ON animals_foods.food_id = foods.food_id
ORDER BY animals.name ASC;

-- delete and animal/food record (M:M)
DELETE FROM animals_foods WHERE animal_id = :animal_id_Input and food_id = :food_id_Input;

-- update amount in animal/food record
UPDATE animals_foods SET amount = :amount_Input;

-- update frequency in animal/food record
UPDATE animals_foods SET x_per_day = :x_per_day_Input;

-- search for diets by animal name
SELECT animals.name, species.species_name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals_foods
JOIN animals ON animals_foods.animal_id = animals.animal_id
JOIN species ON animals.species_id = species.species_id
JOIN foods ON animals_foods.food_id = foods.food_id
WHERE animals.name = :animal_name_Input
ORDER BY animals.name ASC;


--SPONSORS

-- add a sponsor
INSERT INTO sponsors (first_name, last_name, phone_number, email)
VALUES (:first_name_Input, :last_name_Input, :phone_number_Input, :emailInput);

-- display top sponsors
SELECT s.first_name, s.last_name, animals.name, species.species_name, sponsorships.amount FROM sponsors s
INNER JOIN sponsorships ON s.sponsor_id = sponsorships.sponsor_id
INNER JOIN animals ON sponsorships.animal_id = animals.animal_id
INNER JOIN species ON animals.species_id = species.species_id
ORDER BY sponsorships.amount DESC
LIMIT 15;


-- SPONSORSHIPS

-- add a sponsorship
INSERT INTO sponsorships (sponsor_id, date_of_sponsorship, animal_id, amount)
VALUES (:sponsor_id_from_dropdown_Input, :date_of_sponsorship_Input, ;animal_id_from_dropdown_Input, :amountInput);

