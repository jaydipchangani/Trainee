
use Compnay

CREATE TABLE Devices (
    device_id INT PRIMARY KEY IDENTITY(1,1),  
    device_name VARCHAR(50) NOT NULL,
    device_type VARCHAR(50),
    device_quantity INT NOT NULL
);

CREATE TABLE Applications (
    app_id INT PRIMARY KEY IDENTITY(1,1),  
    app_name VARCHAR(50) NOT NULL,
    app_type VARCHAR(50),
);

INSERT INTO Devices (device_name, device_type, device_quantity) VALUES
('Laptop', 'Computer', 50),
('Smartphone', 'Mobile', 100),
('Tablet', 'Mobile', 75),
('Printer', 'Peripheral', 20),
('Scanner', 'Peripheral', 15);


INSERT INTO Applications (app_name, app_type) VALUES
('Microsoft Office', 'Productivity'),
('Adobe Photoshop', 'Graphics'),
('Zoom', 'Communication'),
('Google Chrome', 'Browser'),
('Visual Studio', 'Development');

create table Users(
	user_id INT PRIMARY KEY IDENTITY(1,1),
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
);

CREATE TABLE Marketing_Users (
    marketing_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT UNIQUE, -- One-to-one relationship with Personal_Users
    department VARCHAR(255) NOT NULL,
	campaigns_managed INT NOT NULL,
    marketing_budget DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


INSERT INTO Users(first_name, last_name, email) VALUES
('Alice', 'Smith', 'alice.smith@example.com' ),
('Robert', 'Brown', 'robert.brown@example.com' ),
('Emma', 'Johnson', 'emma.johnson@example.com'),
('Michael', 'Clark', 'michael.clark@example.com' ),
('Sophia', 'Davis', 'sophia.davis@example.com' ),
('William', 'Anderson', 'william.anderson@example.com'),
('Olivia', 'Martinez', 'olivia.martinez@example.com' ),
('James', 'Wilson', 'james.wilson@example.com' ),
('Isabella', 'Taylor', 'isabella.taylor@example.com' );


INSERT INTO Marketing_Users (user_id, department, campaigns_managed, marketing_budget)
VALUES 
(2, 'Digital Marketing', 5, 50000.00),
(4, 'Content Marketing', 3, 25000.00),
(6, 'SEO & SEM', 7, 70000.50),
(9, 'Social Media Marketing', 4, 40000.75);

INSERT INTO Marketing_Users (user_id, department, campaigns_managed, marketing_budget)
VALUES  (8, 'Affiliate Marketing', 6, 60000.00000000008);

SELECT 
    Users.user_id,
    Users.first_name,
	Users.last_name,
    Users.email,
    Marketing_Users.marketing_id,
    Marketing_Users.department,
    Marketing_Users.campaigns_managed,
    Marketing_Users.marketing_budget
FROM 
    Users  
JOIN 
    Marketing_Users ON Users.user_id = Marketing_Users.user_id;

	
SELECT * FROM Devices;
SELECT * FROM Applications;
SELECT * FROM Users;
SELECT * FROM Marketing_Users;

delete from Users where user_id=8