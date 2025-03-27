	USE [SQL TASK 2]

	CREATE TABLE Customers (
		CustomerId INT PRIMARY KEY IDENTITY(1,1),
		CustomerName VARCHAR(50) ,
		Email VARCHAR(50),
		Phone VARCHAR(50),
		DepartmentId INT,
		FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId) 
		);

	CREATE TABLE Orders (
		OrderId INT PRIMARY KEY IDENTITY(101,1),
		CustomerId INT ,
		OrderDate DATE,
		TotalAmount DECIMAL(10, 2),
		FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId) 
		);

	CREATE TABLE Departments (
		DepartmentId INT PRIMARY KEY IDENTITY(1,1),
		DepartmentName VARCHAR(50) ,
		location VARCHAR(50),
	);

	INSERT INTO Departments (DepartmentName, location) VALUES
	('Sales', 'New York'),
	('Marketing', 'London'),
	('Engineering', 'San Francisco'),
	('Human Resources', 'Chicago'),
	('Finance', 'Los Angeles'),
	('Operations', 'Seattle'),
	('Customer Service', 'Miami'),
	('IT', 'Dallas'),
	('Research', 'Boston'),
	('Legal', 'Washington D.C.');

	INSERT INTO Customers (CustomerName, Email, Phone, DepartmentId) VALUES
	('John Doe', 'john.doe@example.com', '555-123-4567', 1),
	('Jane Smith', 'jane.smith@example.com', '555-987-6543', 2),
	('David Lee', 'david.lee@example.com', '555-555-5555', 3),
	('Sarah Jones', 'sarah.jones@example.com', '555-111-2222', 4),
	('Michael Brown', 'michael.brown@example.com', '555-333-4444', 5),
	('Emily Davis', 'emily.davis@example.com', '555-666-7777', 6),
	('Robert Wilson', 'robert.wilson@example.com', '555-888-9999', 7),
	('Ashley Garcia', 'ashley.garcia@example.com', '555-000-1111', 8),
	('William Rodriguez', 'william.rodriguez@example.com', '555-222-3333', 9),
	('Elizabeth Martinez', 'elizabeth.martinez@example.com', '555-444-5555', 10);

	INSERT INTO Orders (CustomerId, OrderDate, TotalAmount) VALUES
	(1, '2023-10-26', 150.00),
	(2, '2023-10-27', 200.00),
	(1, '2023-10-28', 75.00),
	(4, '2023-10-29', 120.00),
	(5, '2023-10-30', 90.00),
	(6, '2023-10-31', 180.00),
	(7, '2023-11-01', 250.00),
	(8, '2023-11-02', 60.00),
	(9, '2023-11-03', 110.00),
	(10, '2023-11-04', 135.00);

	--1st Query
	SELECT Orders.OrderId [Order ID], Customers.CustomerName [Customer Name],Orders.OrderDate [Order Date] 
	FROM Orders INNER JOIN Customers 
	ON Orders.CustomerId=Customers.CustomerId;


	--2nd Query
	SELECT Orders.OrderId [Order ID], Customers.CustomerName [Customer Name],Orders.OrderDate  [Order Date] 
	FROM Orders LEFT JOIN Customers 
	ON Orders.CustomerId=Customers.CustomerId;


	--3rd 

	SELECT Orders.OrderId [Order ID], Customers.CustomerName [Customer Name] ,Orders.OrderDate  [Order Date] 
	FROM Orders RIGHT JOIN Customers 
	ON Orders.CustomerId=Customers.CustomerId;

	--4th full outer join

	SELECT o.OrderId, c.CustomerName, o.OrderDate FROM Orders o FULL OUTER JOIN Customers c ON o.CustomerId = c.CustomerId 

	-- SELECT o.OrderId, c.CustomerName, o.OrderDate FROM Orders o LEFT JOIN Customers c ON o.CustomerId = c.CustomerId UNION SELECT o.OrderId, c.CustomerName, o.OrderDate FROM Orders o RIGHT JOIN Customers c ON o.CustomerId = c.CustomerId ;

	--5th Cross join 
	SELECT o.OrderId, c.CustomerName, o.OrderDate FROM Orders o CROSS JOIN Customers c ;

	--6th 
	SELECT TOP 3 c.CustomerId [Customer ID], c.CustomerName[Customer Name], COUNT(c.CustomerId) as [Total Orders], SUM(o.TotalAmount) as [Total Amount Spend] 
	FROM Orders o  JOIN Customers c ON o.CustomerId = c.CustomerId 
	GROUP BY c.CustomerId, c.CustomerName 
	ORDER BY [Total Amount Spend] DESC;

	--7th
	SELECT c.CustomerId [Customer ID], c.CustomerName[Customer Name],c.Email[Email],c.Phone[Phone] 
	FROM Customers c  LEFT JOIN Orders o 
	ON c.CustomerID = o.CustomerID 
	WHERE o.OrderID IS NULL;

	--8th
	SELECT  c.CustomerId [Customer ID], c.CustomerName [Customer Name], COUNT(c.CustomerId) as [Total Orders], SUM(o.TotalAmount) as [Total Amount Spend] 
	FROM Customers c JOIN Orders o ON o.CustomerId = c.CustomerId 
	AND YEAR(o.OrderDate)=2024
	GROUP BY c.CustomerId, c.CustomerName 

	--9th
	SELECT TOP 5 Departments.DepartmentId [Department ID], Departments.DepartmentName [Department Name],AVG(Orders.TotalAmount) AS [Average Total Amount Spent] 
	FROM Customers 
	JOIN Departments ON Customers.DepartmentId= Departments.DepartmentId
	JOIN Orders ON Customers.CustomerId=Orders.CustomerId
	GROUP BY Departments.DepartmentId,Departments.DepartmentName
	ORDER BY [Average Total Amount Spent] DESC;

	--10th
	SELECT TOP 3 Departments.DepartmentId [Department ID], Departments.DepartmentName [Department Name],count(Orders.TotalAmount) AS [Total Orders] 
	FROM Customers 
	JOIN Departments ON Customers.DepartmentId= Departments.DepartmentId
	JOIN Orders ON Customers.CustomerId=Orders.CustomerId
	GROUP BY Departments.DepartmentId,Departments.DepartmentName
	ORDER BY [Total Orders] DESC --CHANGE
 
	--11th
	SELECT TOP 3 Customers.CustomerId,Customers.CustomerName,SUM(Orders.TotalAmount) AS[Total Amount Spent] 
	FROM Customers JOIN Orders ON Customers.CustomerId=Orders.CustomerId 
	GROUP BY Customers.CustomerId,Customers.CustomerName
	ORDER BY [Total Amount Spent] DESC 
	 

	--12th 
	SELECT d.DepartmentId, d.DepartmentName, COUNT(o.OrderId) AS TotalOrders
	FROM Customers c
	JOIN Departments d ON c.DepartmentId = d.DepartmentId
	JOIN Orders o ON c.CustomerId = o.CustomerId
	GROUP BY d.DepartmentId, d.DepartmentName
	HAVING COUNT(c.CustomerId) >= 2
	ORDER BY TotalOrders DESC; --CHANGE

	--13th CHANGE
	SELECT c.CustomerId, c.CustomerName, c.Email, c.Phone
	FROM Customers c
	JOIN Orders o ON c.CustomerId = o.CustomerId
	WHERE YEAR(o.OrderDate) IN (2023, 2024)
	GROUP BY c.CustomerId, c.CustomerName, c.Email, c.Phone
	HAVING COUNT(DISTINCT YEAR(o.OrderDate)) = 2;



	select * from Departments
	select * from Orders
	select * from Customers
