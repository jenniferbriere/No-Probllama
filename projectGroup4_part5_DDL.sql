--
-- Data Definition Queries for No Probllama! Database
--

-- Create Species Table

CREATE TABLE species (
species_id int(11) NOT NULL AUTO_INCREMENT,
species_name varchar (255) NOT NULL,
PRIMARY KEY (species_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create Foods Table

CREATE TABLE foods 	(
food_id int(11) AUTO_INCREMENT,
food_type varchar (255) NOT NULL,
inventory int (11) NOT NULL,
PRIMARY KEY (food_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create Sponsors Table

CREATE TABLE sponsors (
sponsor_id int(11) NOT NULL AUTO_INCREMENT,
first_name varchar (255) NOT NULL,
last_name varchar (255) NOT NULL,
phone_number varchar (255) NOT NULL,
email varchar (255) NOT NULL,
PRIMARY KEY (sponsor_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create Animals Table

CREATE TABLE animals (
animal_id int(11) NOT NULL AUTO_INCREMENT,
name varchar (255) NOT NULL,
species_id int (11),
birthdate date,
active tinyint (1) NOT NULL,
PRIMARY KEY (animal_id),
FOREIGN KEY (species_id) REFERENCES species (species_id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create Sponsorships Table

CREATE TABLE sponsorships (
sponsorship_id int(11) NOT NULL AUTO_INCREMENT,
sponsor_id int NOT NULL,
date_of_sponsorship date NOT NULL,
animal_id int NOT NULL,
amount decimal (8,2) NOT NULL,
PRIMARY KEY (sponsorship_id),
FOREIGN KEY (sponsor_id) REFERENCES sponsors (sponsor_id) ON DELETE NO ACTION ON UPDATE CASCADE, 
FOREIGN KEY (animal_id) REFERENCES animals (animal_id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create Animals_Foods Table

CREATE TABLE animals_foods (
animal_id int NOT NULL,
food_id int NOT NULL,
amount int(11) NOT NULL,
x_per_day int(11) NOT NULL,
PRIMARY KEY (animal_id, food_id),
FOREIGN KEY (animal_id) REFERENCES animals (animal_id) ON DELETE NO ACTION ON UPDATE CASCADE,
FOREIGN KEY (food_id) REFERENCES foods (food_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Sample data is added to each table below
--
-- Insert Into Species Table


INSERT INTO species (species_name)
VALUES ("Llama"),
("Tiger"),
("Moose");

-- Insert Into Food Table

INSERT INTO foods (food_type, inventory)
VALUES ("Carrots", 200),
("Hay", 3000),
("Chicken", 500),
("Apples", 20);

-- Insert Into Sponsors Table

INSERT INTO sponsors (first_name, last_name, phone_number, email)
VALUES ("George", "Washington", "5035551776", "gw@gmail.com"),
("Barack", "Obama", "2025551111", "barack@gmail.com"),
("John", "Doe", "8005551234", "WhoAmI@gmail.com");

-- Insert Into Animals Table

INSERT INTO animals (name, species_id, birthdate, active)
VALUES ("Bob", 1, "2016-01-01", 1),
("George", 2, "2008-05-06", 0),
("Fudge", 3, NULL, 1);

-- Insert Into Sponsorships Table

INSERT INTO sponsorships (sponsor_id, date_of_sponsorship, animal_id, amount)
VALUES (1, "2015-02-04", 1, 300),
(2, "2013-04-13", 2, 150),
(3, "2011-10-13", 1, 100),
(2, "2018-04-20", 1, 50);

-- Insert Into Animals_Foods Table

INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day)
VALUES (1, 1, 3, 1),
(1, 4, 5, 3),
(2, 3, 2, 1),
(2, 4, 2, 1),
(3, 4, 2, 3),
(3, 2, 3, 2);
