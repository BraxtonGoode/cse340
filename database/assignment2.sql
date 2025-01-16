-- assignment 2 sql statements
INSERT INTO public.account 
(
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES 
(
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);
-- asignment 2 update 
UPDATE account 
SET account_type = 'Admin' 
Where account_id = 1;

-- delete tony Stark record
DELETE FROM account
WHERE account_id = 1;

-- modify GM Hummer statement
UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- inner Join 
SELECT
	inv_make,
	inv_model,
	classification_name
FROM 
	public.inventory
INNER JOIN public.classification
	ON classification.classification_id = inventory.classification_id
WHERE
	classification.classification_name = 'Sport';
-- Update all Inventory image and thumbnails
UPDATE 
	public.inventory
SET 
	inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');