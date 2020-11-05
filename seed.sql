DROP DATABASE IF EXISTS employeeTracker;
CREATE DATABASE employeeTracker;
USE employeeTracker;

CREATE TABLE `department` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(30)
);

CREATE TABLE `role` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(30),
  `salary` decimal,
  `department_id` integer
);

CREATE TABLE `employee` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(30),
  `last_name` varchar(40),
  `role_id` integer,
  `manager_id` integer
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
("Shaun", "Samoridny", 1, 10),
("Bruce", "Wayne", 1, 10),
("Clark", "Kent", 1, null),
("Arthur", "Curry", 1, null),
("Barry", "Allen", 1, null);

INSERT INTO `role` (`id`, `title`, `salary`, `department_id`) VALUES 
	(1, 'Sales Lead', 100000, 1),
    (2, 'Salesperson', 80000, 1),
    (3, 'Lead Engineer', 150000, 2),
    (4, 'Software Enginner', 120000, 2),
    (5, 'Accountant', 125000, 4),
    (6, 'Legal Team Lead', 250000, 3),
    (7, 'Lawyer', 120000, 3);

INSERT INTO `department` (`id`, `name`) VALUES (1, 'Sales'), (2, 'Engineering'), (3, 'Legal'), (4, 'Finance');