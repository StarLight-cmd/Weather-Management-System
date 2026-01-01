-- Insert into country only if country_code does not exist
INSERT INTO country (country_code, police_no, firedep_no, ambulance_no)
SELECT 'ZA', '10111', '102', '10177'
WHERE NOT EXISTS (SELECT 1 FROM country WHERE country_code = 'ZA');

INSERT INTO country (country_code, police_no, firedep_no, ambulance_no)
SELECT 'US', '911', '911', '911'
WHERE NOT EXISTS (SELECT 1 FROM country WHERE country_code = 'US');

-- Insert into user only if email does not exist
INSERT INTO `user` (email, password, admin)
SELECT 'user@gmail.com', '110', 0
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE email = 'user@gmail.com');

INSERT INTO `user` (email, password, admin)
SELECT 'admin@outlook.com', '001', 1
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE email = 'admin@outlook.com');

-- Insert into subscription only if user_id and location combination does not exist
INSERT INTO subscription (user_id, location)
SELECT u.id, 'Johannesburg'
FROM `user` u
WHERE u.email = 'user@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM subscription s WHERE s.user_id = u.id AND s.location = 'Johannesburg'
  );

INSERT INTO subscription (user_id, location)
SELECT u.id, 'Cape Town'
FROM `user` u
WHERE u.email = 'user@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM subscription s WHERE s.user_id = u.id AND s.location = 'Cape Town'
  );

INSERT INTO subscription (user_id, location)
SELECT u.id, 'Los Angeles'
FROM `user` u
WHERE u.email = 'admin@outlook.com'
  AND NOT EXISTS (
    SELECT 1 FROM subscription s WHERE s.user_id = u.id AND s.location = 'Los Angeles'
  );

-- Insert into shelter only if shelter name does not exist
INSERT INTO shelter (shelter_lat, shelter_lon, name, phone_no, address, country_code)
SELECT -26.2041, 28.0473, 'Joburg Shelter', '0111234567', '123 Main Rd, Johannesburg', 'ZA'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'Joburg Shelter');

INSERT INTO shelter (shelter_lat, shelter_lon, name, phone_no, address, country_code)
SELECT -33.9249, 18.4241, 'Cape Town Shelter', '0219876543', '456 Ocean View, Cape Town', 'ZA'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'Cape Town Shelter');

INSERT INTO shelter (shelter_lat, shelter_lon, name, phone_no, address, country_code)
SELECT 34.0522, -118.2437, 'LA Shelter', '2135557890', '789 Sunset Blvd, LA', 'US'
WHERE NOT EXISTS (SELECT 1 FROM shelter WHERE name = 'LA Shelter');
