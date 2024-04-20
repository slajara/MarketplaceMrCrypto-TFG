import { ethers } from "hardhat";

async function main() {
  const MockERC721 = await ethers.getContractFactory("MrCrypto");
  const mockERC721 = await MockERC721.attach(
    "0x86c2e28e458767C11CCd668182080Fe4f7fBfccF",
  );

  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
  await mockERC721.mintNft();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
