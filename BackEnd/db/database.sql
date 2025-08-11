CREATE TABLE Computer (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);

CREATE TABLE Printer (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);

-- Crie para cada coleção semelhante:
CREATE TABLE Projector (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);
CREATE TABLE Monitor (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100));
CREATE TABLE Scanner (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);

CREATE TABLE NetworkDevice (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);

CREATE TABLE StorageDevice (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  status VARCHAR(100)
);

CREATE TABLE Accessories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  model VARCHAR(100),
  status VARCHAR(100)
);
