-- CreateTable
CREATE TABLE `Equipment` (
    `id` VARCHAR(50) NOT NULL,
    `category` ENUM('Computer', 'Printer', 'Projector', 'Monitor', 'Scanner', 'NetworkDevice', 'StorageDevice', 'Accessories') NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('Desktop', 'Laptop', 'Inkjet', 'Laser', 'Other') NULL DEFAULT 'Other',
    `model` VARCHAR(100) NULL,
    `status` ENUM('Active', 'Inactive', 'Maintenance') NULL DEFAULT 'Active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alocacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `equipamento_id` VARCHAR(50) NOT NULL,
    `data_alocacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alocacoes` ADD CONSTRAINT `Alocacoes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alocacoes` ADD CONSTRAINT `Alocacoes_equipamento_id_fkey` FOREIGN KEY (`equipamento_id`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
