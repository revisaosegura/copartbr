ALTER TABLE `vehicles`
  ADD COLUMN `auctionDate` timestamp NULL,
  ADD COLUMN `auctionTime` varchar(20) NULL,
  ADD COLUMN `saleStatus` varchar(100) NULL;
