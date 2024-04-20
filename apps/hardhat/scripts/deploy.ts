import fs from "fs";
import { ethers } from "hardhat";

async function main() {
  const nameERC721 = "Mr.Crypto";
  const symbolERC721 = "MRC";
  const supplyERC721 = 10000;

  const nameERC20 = "TokenMRC";
  const symbolERC20 = "TMRC";

  const MockERC721 = await ethers.getContractFactory("MrCrypto");
  const mockERC721 = await MockERC721.deploy(nameERC20, symbolERC20);

  const E7LMarketplace = await ethers.getContractFactory("E7LMarketplace");
  const e7LMarketplace = await E7LMarketplace.deploy(mockERC721.address);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy(
    nameERC721,
    symbolERC721,
    supplyERC721,
  );

  await mockERC721.deployed();
  console.log(`Dirección MockERC721: ${mockERC721.address}`);
  await e7LMarketplace.deployed();
  console.log(`Dirección E7LMarketplace: ${e7LMarketplace.address}`);
  await mockERC20.deployed();
  console.log(`Dirección MockERC20: ${mockERC20.address}`);

  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();

  const constantERC721 = {
    address: mockERC721.address,
    abi: mockERC721.interface.format(ethers.utils.FormatTypes.json),
  };
  const constantMarketplace = {
    address: e7LMarketplace.address,
    abi: e7LMarketplace.interface.format(ethers.utils.FormatTypes.json),
  };
  const constantERC20 = {
    address: mockERC20.address,
    abi: mockERC20.interface.format(ethers.utils.FormatTypes.json),
  };

  fs.writeFileSync(
    "../nextjs/src/constants/constantERC721.json",
    JSON.stringify(constantERC721),
  );
  fs.writeFileSync(
    "../nextjs/src/constants/constantMarketplace.json",
    JSON.stringify(constantMarketplace),
  );
  fs.writeFileSync(
    "../nextjs/src/constants/constantERC20.json",
    JSON.stringify(constantERC20),
  );
  console.log("Constants written");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
