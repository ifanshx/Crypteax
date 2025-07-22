-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('STAKE', 'UNSTAKE', 'CLAIM_REWARDS', 'PROFILE_UPDATE', 'WHITELIST_MINT', 'PUBLIC_MINT', 'RAFFLE_JOIN', 'RAFFLE_WIN', 'RAFFLE_CREATE', 'RAFFLE_DRAW', 'NFT_TRANSFER', 'COLLECTION_CREATE', 'COLLECTION_UPDATE', 'COLLECTION_DEPLOY', 'COLLECTION_VERIFY', 'USER_BLOCKED', 'USER_REFERRAL', 'REFERRAL_POINTS_EARNED', 'POINTS_SPENT', 'POINTS_ADJUSTMENT', 'RAFFLE_TICKET_PURCHASE');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('PENDING', 'DEPLOYING', 'DEPLOYMENT_FAILED', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('ERC721', 'ERC1155', 'ERC404');

-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('SIGNUP_BONUS', 'MINT_COMMISSION', 'STAKE_REWARD', 'DAILY_STAKE_REWARD', 'RAFFLE_TICKET_BONUS', 'RAFFLE_ENTRY_BONUS', 'REFERRAL_BONUS', 'ADMIN_ADJUSTMENT', 'RAFFLE_WINNER_BONUS', 'LOYALTY_REWARD', 'REDEEM');

-- CreateEnum
CREATE TYPE "BlockchainNetwork" AS ENUM ('TEA');

-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RewardTxType" AS ENUM ('DAILY_STAKE', 'RAFFLE_WIN', 'REFERRAL_BONUS', 'ADMIN_AWARD');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "user_username" TEXT,
    "user_image" TEXT,
    "user_role" "UserRole" NOT NULL DEFAULT 'USER',
    "user_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updatedAt" TIMESTAMP(3) NOT NULL,
    "user_address" TEXT NOT NULL,
    "user_isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "user_referralCode" TEXT NOT NULL,
    "user_referredBy" TEXT,
    "user_points" INTEGER NOT NULL DEFAULT 0,
    "user_rewardWalletAddress" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "referral_points" (
    "point_id" TEXT NOT NULL,
    "point_referrerId" TEXT NOT NULL,
    "point_referredUserId" TEXT NOT NULL,
    "point_amount" INTEGER NOT NULL,
    "point_type" "PointType" NOT NULL,
    "point_status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "point_description" TEXT,
    "point_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "point_txHash" TEXT,

    CONSTRAINT "referral_points_pkey" PRIMARY KEY ("point_id")
);

-- CreateTable
CREATE TABLE "nft_collections" (
    "collection_id" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "collection_symbol" TEXT,
    "collection_description" TEXT,
    "collection_imageUrl" TEXT,
    "collection_bannerUrl" TEXT,
    "collection_twitterUrl" TEXT,
    "collection_discordUrl" TEXT,
    "collection_websiteUrl" TEXT,
    "collection_type" "CollectionType" NOT NULL DEFAULT 'ERC721',
    "collection_contractAddress" TEXT NOT NULL,
    "collection_deployedTxHash" TEXT,
    "collection_blockchainNetwork" "BlockchainNetwork",
    "collection_mintPrice" DECIMAL(65,30),
    "collection_mintCurrency" TEXT,
    "collection_maxSupply" INTEGER,
    "collection_currentSupply" INTEGER NOT NULL DEFAULT 0,
    "collection_mintLimitPerWallet" INTEGER,
    "collection_publicMintStartDate" TIMESTAMP(3),
    "collection_publicMintEndDate" TIMESTAMP(3),
    "collection_whitelistStartDate" TIMESTAMP(3),
    "collection_whitelistEndDate" TIMESTAMP(3),
    "collection_whitelistMerkleRoot" TEXT,
    "collection_royaltyBps" INTEGER,
    "collection_platformFeeBps" INTEGER,
    "collection_status" "CollectionStatus" NOT NULL DEFAULT 'PENDING',
    "collection_verified" BOOLEAN NOT NULL DEFAULT false,
    "collection_verifiedBy" TEXT,
    "collection_creatorAddress" TEXT NOT NULL,
    "collection_createdBy" TEXT NOT NULL,
    "collection_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collection_updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nft_collections_pkey" PRIMARY KEY ("collection_id")
);

-- CreateTable
CREATE TABLE "trait_categories" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "trait_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traits" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rarity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_items" (
    "nft_id" TEXT NOT NULL,
    "nft_contractAddress" TEXT NOT NULL,
    "nft_tokenId" INTEGER NOT NULL,
    "nft_ownerAddress" TEXT NOT NULL,
    "nft_imageUrl" TEXT,
    "nft_name" TEXT,
    "nft_description" TEXT,
    "nft_attributes" JSONB,
    "nft_collectionId" TEXT NOT NULL,
    "nft_lastOwnerSync" TIMESTAMP(3),
    "nft_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nft_updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nft_items_pkey" PRIMARY KEY ("nft_id")
);

-- CreateTable
CREATE TABLE "staked_nfts" (
    "staked_id" TEXT NOT NULL,
    "staked_userId" TEXT NOT NULL,
    "staked_nftItemId" TEXT NOT NULL,
    "staked_stakeTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staked_unstakeTimestamp" TIMESTAMP(3),
    "staked_isStaked" BOOLEAN NOT NULL DEFAULT true,
    "staked_isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "staked_claimedRewards" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "staked_lastRewardClaimedAt" TIMESTAMP(3),
    "staked_lockPeriodDays" INTEGER DEFAULT 30,
    "staked_emergencyFeeBps" INTEGER DEFAULT 1000,
    "staked_rewardMultiplier" DOUBLE PRECISION DEFAULT 1.0,

    CONSTRAINT "staked_nfts_pkey" PRIMARY KEY ("staked_id")
);

-- CreateTable
CREATE TABLE "reward_transactions" (
    "rewardTx_id" TEXT NOT NULL,
    "rewardTx_userId" TEXT NOT NULL,
    "rewardTx_stakedId" TEXT,
    "rewardTx_amount" DECIMAL(65,30) NOT NULL,
    "rewardTx_type" "RewardTxType" NOT NULL,
    "rewardTx_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_transactions_pkey" PRIMARY KEY ("rewardTx_id")
);

-- CreateTable
CREATE TABLE "stake_leaderboards" (
    "leaderboard_id" TEXT NOT NULL,
    "leaderboard_userId" TEXT NOT NULL,
    "leaderboard_totalStakedNfts" INTEGER NOT NULL DEFAULT 0,
    "leaderboard_totalRewardsClaimed" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "leaderboard_rank" INTEGER NOT NULL DEFAULT 0,
    "leaderboard_lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stake_leaderboards_pkey" PRIMARY KEY ("leaderboard_id")
);

-- CreateTable
CREATE TABLE "raffles" (
    "raffle_id" TEXT NOT NULL,
    "raffle_title" TEXT NOT NULL,
    "raffle_description" TEXT,
    "raffle_totalTickets" INTEGER NOT NULL,
    "raffle_ticketPrice" DECIMAL(65,30) NOT NULL,
    "raffle_maxEntriesPerUser" INTEGER NOT NULL,
    "raffle_startDate" TIMESTAMP(3) NOT NULL,
    "raffle_endDate" TIMESTAMP(3) NOT NULL,
    "raffle_raffleBanner" TEXT,
    "raffle_ticketsSold" INTEGER NOT NULL DEFAULT 0,
    "raffle_status" "RaffleStatus" NOT NULL DEFAULT 'UPCOMING',
    "raffle_winnerAddress" TEXT,
    "raffle_winnerNftItemId" TEXT,
    "raffle_prizeType" TEXT DEFAULT 'NFT',
    "raffle_tokenAddress" TEXT,
    "raffle_tokenAmount" DECIMAL(65,30),
    "raffle_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raffle_updatedAt" TIMESTAMP(3) NOT NULL,
    "raffle_collectionId" TEXT,
    "raffle_createdBy" TEXT NOT NULL,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("raffle_id")
);

-- CreateTable
CREATE TABLE "raffle_participants" (
    "participant_id" TEXT NOT NULL,
    "participant_raffleId" TEXT NOT NULL,
    "participant_userId" TEXT NOT NULL,
    "participant_walletAddress" TEXT NOT NULL,
    "participant_ticketsBought" INTEGER NOT NULL,
    "participant_purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raffle_participants_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "activities" (
    "activity_id" TEXT NOT NULL,
    "activity_userId" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "activity_description" TEXT NOT NULL,
    "activity_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activity_txHash" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "whitelists" (
    "whitelist_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "allocatedMints" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "whitelists_pkey" PRIMARY KEY ("whitelist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_username_key" ON "users"("user_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_address_key" ON "users"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_referralCode_key" ON "users"("user_referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "referral_points_point_txHash_key" ON "referral_points"("point_txHash");

-- CreateIndex
CREATE INDEX "referral_points_point_referrerId_idx" ON "referral_points"("point_referrerId");

-- CreateIndex
CREATE INDEX "referral_points_point_referredUserId_idx" ON "referral_points"("point_referredUserId");

-- CreateIndex
CREATE INDEX "referral_points_point_type_idx" ON "referral_points"("point_type");

-- CreateIndex
CREATE INDEX "referral_points_point_status_idx" ON "referral_points"("point_status");

-- CreateIndex
CREATE INDEX "referral_points_point_createdAt_idx" ON "referral_points"("point_createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "nft_collections_collection_contractAddress_key" ON "nft_collections"("collection_contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "nft_collections_collection_deployedTxHash_key" ON "nft_collections"("collection_deployedTxHash");

-- CreateIndex
CREATE INDEX "nft_collections_collection_contractAddress_idx" ON "nft_collections"("collection_contractAddress");

-- CreateIndex
CREATE INDEX "nft_collections_collection_name_idx" ON "nft_collections"("collection_name");

-- CreateIndex
CREATE INDEX "nft_collections_collection_status_idx" ON "nft_collections"("collection_status");

-- CreateIndex
CREATE INDEX "nft_collections_collection_createdBy_idx" ON "nft_collections"("collection_createdBy");

-- CreateIndex
CREATE INDEX "nft_collections_collection_type_idx" ON "nft_collections"("collection_type");

-- CreateIndex
CREATE INDEX "nft_collections_collection_publicMintStartDate_idx" ON "nft_collections"("collection_publicMintStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "trait_categories_collectionId_name_key" ON "trait_categories"("collectionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "traits_categoryId_name_key" ON "traits"("categoryId", "name");

-- CreateIndex
CREATE INDEX "nft_items_nft_ownerAddress_idx" ON "nft_items"("nft_ownerAddress");

-- CreateIndex
CREATE INDEX "nft_items_nft_collectionId_idx" ON "nft_items"("nft_collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "nft_items_nft_contractAddress_nft_tokenId_key" ON "nft_items"("nft_contractAddress", "nft_tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "staked_nfts_staked_nftItemId_key" ON "staked_nfts"("staked_nftItemId");

-- CreateIndex
CREATE INDEX "staked_nfts_staked_userId_idx" ON "staked_nfts"("staked_userId");

-- CreateIndex
CREATE INDEX "staked_nfts_staked_isStaked_idx" ON "staked_nfts"("staked_isStaked");

-- CreateIndex
CREATE UNIQUE INDEX "staked_nfts_staked_userId_staked_nftItemId_key" ON "staked_nfts"("staked_userId", "staked_nftItemId");

-- CreateIndex
CREATE INDEX "reward_transactions_rewardTx_userId_idx" ON "reward_transactions"("rewardTx_userId");

-- CreateIndex
CREATE INDEX "reward_transactions_rewardTx_stakedId_idx" ON "reward_transactions"("rewardTx_stakedId");

-- CreateIndex
CREATE INDEX "reward_transactions_rewardTx_timestamp_idx" ON "reward_transactions"("rewardTx_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "stake_leaderboards_leaderboard_userId_key" ON "stake_leaderboards"("leaderboard_userId");

-- CreateIndex
CREATE INDEX "stake_leaderboards_leaderboard_totalStakedNfts_idx" ON "stake_leaderboards"("leaderboard_totalStakedNfts");

-- CreateIndex
CREATE INDEX "stake_leaderboards_leaderboard_totalRewardsClaimed_idx" ON "stake_leaderboards"("leaderboard_totalRewardsClaimed");

-- CreateIndex
CREATE INDEX "stake_leaderboards_leaderboard_rank_idx" ON "stake_leaderboards"("leaderboard_rank");

-- CreateIndex
CREATE UNIQUE INDEX "raffles_raffle_winnerNftItemId_key" ON "raffles"("raffle_winnerNftItemId");

-- CreateIndex
CREATE INDEX "raffles_raffle_status_raffle_endDate_idx" ON "raffles"("raffle_status", "raffle_endDate");

-- CreateIndex
CREATE INDEX "raffles_raffle_title_idx" ON "raffles"("raffle_title");

-- CreateIndex
CREATE INDEX "raffles_raffle_collectionId_idx" ON "raffles"("raffle_collectionId");

-- CreateIndex
CREATE INDEX "raffles_raffle_createdBy_idx" ON "raffles"("raffle_createdBy");

-- CreateIndex
CREATE INDEX "raffle_participants_participant_raffleId_participant_wallet_idx" ON "raffle_participants"("participant_raffleId", "participant_walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "raffle_participants_participant_raffleId_participant_userId_key" ON "raffle_participants"("participant_raffleId", "participant_userId");

-- CreateIndex
CREATE UNIQUE INDEX "activities_activity_txHash_key" ON "activities"("activity_txHash");

-- CreateIndex
CREATE INDEX "activities_activity_userId_idx" ON "activities"("activity_userId");

-- CreateIndex
CREATE INDEX "activities_activity_timestamp_idx" ON "activities"("activity_timestamp");

-- CreateIndex
CREATE INDEX "activities_activity_type_idx" ON "activities"("activity_type");

-- CreateIndex
CREATE UNIQUE INDEX "whitelists_collection_id_user_id_key" ON "whitelists"("collection_id", "user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_user_referredBy_fkey" FOREIGN KEY ("user_referredBy") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_points" ADD CONSTRAINT "referral_points_point_referrerId_fkey" FOREIGN KEY ("point_referrerId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_points" ADD CONSTRAINT "referral_points_point_referredUserId_fkey" FOREIGN KEY ("point_referredUserId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_collections" ADD CONSTRAINT "nft_collections_collection_createdBy_fkey" FOREIGN KEY ("collection_createdBy") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trait_categories" ADD CONSTRAINT "trait_categories_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "nft_collections"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traits" ADD CONSTRAINT "traits_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "trait_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_items" ADD CONSTRAINT "nft_items_nft_collectionId_fkey" FOREIGN KEY ("nft_collectionId") REFERENCES "nft_collections"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staked_nfts" ADD CONSTRAINT "staked_nfts_staked_userId_fkey" FOREIGN KEY ("staked_userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staked_nfts" ADD CONSTRAINT "staked_nfts_staked_nftItemId_fkey" FOREIGN KEY ("staked_nftItemId") REFERENCES "nft_items"("nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_rewardTx_userId_fkey" FOREIGN KEY ("rewardTx_userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_rewardTx_stakedId_fkey" FOREIGN KEY ("rewardTx_stakedId") REFERENCES "staked_nfts"("staked_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stake_leaderboards" ADD CONSTRAINT "stake_leaderboards_leaderboard_userId_fkey" FOREIGN KEY ("leaderboard_userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_raffle_winnerNftItemId_fkey" FOREIGN KEY ("raffle_winnerNftItemId") REFERENCES "nft_items"("nft_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_raffle_collectionId_fkey" FOREIGN KEY ("raffle_collectionId") REFERENCES "nft_collections"("collection_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_raffle_createdBy_fkey" FOREIGN KEY ("raffle_createdBy") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_participants" ADD CONSTRAINT "raffle_participants_participant_raffleId_fkey" FOREIGN KEY ("participant_raffleId") REFERENCES "raffles"("raffle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_participants" ADD CONSTRAINT "raffle_participants_participant_userId_fkey" FOREIGN KEY ("participant_userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_activity_userId_fkey" FOREIGN KEY ("activity_userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whitelists" ADD CONSTRAINT "whitelists_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "nft_collections"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whitelists" ADD CONSTRAINT "whitelists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
