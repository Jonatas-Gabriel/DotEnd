CREATE TABLE Equipment (
  id VARCHAR(50) PRIMARY KEY,
  category ENUM(
    'Computer', 
    'Printer', 
    'Projector', 
    'Monitor', 
    'Scanner', 
    'NetworkDevice', 
    'StorageDevice', 
    'Accessories'
  ) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM(
    'Desktop', 
    'Laptop', 
    'Inkjet', 
    'Laser', 
    'Other'
  ) DEFAULT 'Other',
  model VARCHAR(100),
  status ENUM('Active', 'Inactive', 'Maintenance') DEFAULT 'Active'
);

-- Adicione ao final de database.sql

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alocacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  equipamento_id VARCHAR(50) NOT NULL,
  equipamento_tabela VARCHAR(100) NOT NULL,
  data_alocacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
