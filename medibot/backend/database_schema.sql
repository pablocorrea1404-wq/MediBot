-- Esquema inicial de base de datos
-- Si el volumen ya existe, esto se ignora.

CREATE TABLE IF NOT EXISTS patient (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dni VARCHAR(20) DEFAULT NULL,
    UNIQUE (dni),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS appointment (
    id INT AUTO_INCREMENT NOT NULL,
    patient_id INT NOT NULL,
    staff_id INT DEFAULT NULL,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    google_calendar_id VARCHAR(255) DEFAULT NULL,
    notes_ia LONGTEXT DEFAULT NULL,
    INDEX IDX_FE38F8446B899279 (patient_id),
    INDEX IDX_FE38F844D4D57CD (staff_id),
    PRIMARY KEY(id),
    CONSTRAINT FK_FE38F8446B899279 FOREIGN KEY (patient_id) REFERENCES patient (id),
    CONSTRAINT FK_FE38F844D4D57CD FOREIGN KEY (staff_id) REFERENCES staff (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;
