-- DROP DATABASE IF EXISTS empolyeeManagmentSystem;
CREATE DATABASE empolyeeManagmentSystem;

USE empolyeeManagmentSystem;


-- Get values from the image in assets for each table the values are shown in the image so just followed that
-- department is just id and name with primary key
CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

-- role is id title salary and department_id 
CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2) NOT NULL,
    department_id VARCHAR(60) NOT NULL,
    PRIMARY KEY(id)
);

-- employee is id first_name last_name role_id manager_id 
CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    is_manager BOOLEAN NOT NULL ,
    manager_id INT ,
    PRIMARY KEY(id)
);

