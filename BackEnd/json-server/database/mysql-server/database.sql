CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

CREATE TABLE Devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    model VARCHAR(100),
    status VARCHAR(50),
    category ENUM(
        'Computer',
        'Printer',
        'Projector',
        'Monitor',
        'Scanner',
        'NetworkDevice',
        'StorageDevice',
        'Accessories'
    ) NOT NULL
);