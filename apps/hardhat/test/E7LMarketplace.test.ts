import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("E7LMarketplace", function () {
  async function deployE7LMarketPlaceContract() {
    const nameERC20 = "Mr.Crypto";
    const symbolERC20 = "MRC";
    // const MrCryptoAddress = 0xef453154766505feb9dbf0a58e6990fd6eb66969;
    const nameERC721 = "Mr.Crypto";
    const symbolERC721 = "MRC";
    const supplyERC721 = 10000;

    const [owner, add1, add2, add3, add4, add5] = await ethers.getSigners();

    const MockERC721 = await ethers.getContractFactory("MrCrypto");
    const mockERC721 = await MockERC721.deploy(nameERC20, symbolERC20);

    await mockERC721.connect(owner).mintNft();

    const E7LMarketplace = await ethers.getContractFactory("E7LMarketplace");
    const e7LMarketplace = await E7LMarketplace.deploy(mockERC721.address);

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy(
      nameERC721,
      symbolERC721,
      supplyERC721,
    );
    const mockERC20_2 = await MockERC20.deploy(
      nameERC721,
      symbolERC721,
      supplyERC721,
    );

    await e7LMarketplace.setPaytokenWhitelist(mockERC20.address, true);

    await mockERC20.transfer(add1.address, 100);

    return {
      e7LMarketplace,
      mockERC20,
      mockERC20_2,
      mockERC721,
      owner,
      add1,
      add2,
      add3,
      add4,
      add5,
    };
  }

  /**
   * Test plan Sergio
   * - Buy item
   * - Buy item tokenId = 0
   * - Buy item not listed
   * - Buy item with paytoken address(0)
   * - Buy item sended value < listing.price
   * - Assert wallet has N items previously bought it
   */

  describe("Listing actions", function () {
    it("List with price 0 => Pass if reverted with PriceMustBeAboveZero error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await expect(
        e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 0),
      ).to.be.revertedWithCustomError(e7LMarketplace, "PriceMustBeAboveZero");
    });

    it("List item not approved by nft contract => Pass if reverted with NotApprovedForMarketplace error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await expect(
        e7LMarketplace
          .connect(owner)
          .listItem(ethers.constants.AddressZero, 1, 23),
      ).to.be.revertedWithCustomError(
        e7LMarketplace,
        "NotApprovedForMarketplace",
      );
    });

    it("List item", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);
      await expect(
        e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23),
      ).to.emit(e7LMarketplace, "ItemListed");
    });

    it("List item already listed => Pass if reverted with AlreadyListed error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);
      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);
      await expect(
        e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 22),
      ).to.be.revertedWithCustomError(e7LMarketplace, "AlreadyListed");
    });

    it("List item with paytoken not in whitelist", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);
      await expect(
        e7LMarketplace.connect(owner).listItem(mockERC721.address, 1, 23),
      ).to.be.revertedWithCustomError(
        e7LMarketplace,
        "PayTokenAddressNotValid",
      );
    });

    it("List with address(0) => Pass if list success", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);

      await expect(
        e7LMarketplace
          .connect(owner)
          .listItem(ethers.constants.AddressZero, 1, 23),
      ).to.be.not.reverted;
    });

    it("List item with tokenId = 0 => Pass if reverted with TokenIdNotValid error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);

      await expect(
        e7LMarketplace.connect(owner).listItem(mockERC20.address, 0, 23),
      ).to.be.revertedWithCustomError(e7LMarketplace, "TokenIdNotValid");
    });

    it("List item not owner => Pass if reverted with NotOwner() error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);
      await expect(
        e7LMarketplace.connect(add1).listItem(mockERC20.address, 1, 23),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotOwner");
    });
  });

  describe("Cancel actions", function () {
    it("Cancel item", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);

      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);

      await expect(e7LMarketplace.connect(owner).cancelListing(1)).to.emit(
        e7LMarketplace,
        "ItemCanceled",
      );
    });

    it("Cancel item not listed => Pass if reverted with NotListed() error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await expect(e7LMarketplace.connect(owner).cancelListing(1)).to.be
        .reverted;
    });

    it("Cancel item not owner => Pass if reverted with NotOwner() error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await mockERC721.approve(e7LMarketplace.address, 1);
      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);
      await expect(
        e7LMarketplace.connect(add1).cancelListing(1),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotOwner");
    });
  });

  describe("Modify actions", function () {
    it("Modify item => Pass if modify success and price equals 50", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const newPrice = 50;

      await mockERC721.approve(e7LMarketplace.address, 1);
      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);
      await expect(
        e7LMarketplace
          .connect(owner)
          .modifyItem(mockERC20.address, 1, newPrice),
      ).to.emit(e7LMarketplace, "ItemListed");

      expect((await e7LMarketplace.listings(1)).price).to.be.equal(newPrice);
    });

    it("Modify item with price = 0 => Pass if revert with PriceMustBeAboveZero error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const newPrice = 0;

      await mockERC721.approve(e7LMarketplace.address, 1);
      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);
      await expect(
        e7LMarketplace
          .connect(owner)
          .modifyItem(mockERC20.address, 1, newPrice),
      ).to.be.revertedWithCustomError(e7LMarketplace, "PriceMustBeAboveZero");
    });

    //si quiero que me paguen en token nativo, cambio el paytokenaddresss a address(0)
    it("Modify item with payTokenAddress = address(0) => Pass if success", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const newPrice = 50;

      await mockERC721.approve(e7LMarketplace.address, 1);
      await e7LMarketplace.connect(owner).listItem(mockERC20.address, 1, 23);

      await expect(
        e7LMarketplace
          .connect(owner)
          .modifyItem(ethers.constants.AddressZero, 1, newPrice),
      ).to.be.not.reverted;
    });

    it("Modify item with tokenId = 0 => Pass if revert with NotListed error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const newPrice = 50;

      await expect(
        e7LMarketplace
          .connect(owner)
          .modifyItem(mockERC721.address, 0, newPrice),
      ).to.be.revertedWithCustomError(e7LMarketplace, "TokenIdNotValid");
    });

    it("Modify item not owner => Pass if revert with NotOwner error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const newPrice = 50;

      await expect(
        e7LMarketplace
          .connect(add1)
          .modifyItem(mockERC721.address, 1, newPrice),
      ).to.be.reverted;
    });
  });

  describe("Buy actions", function () {
    it("Buy item => Pass if emit ItemBought event and add1 erc720 = 50 and add1 erc721 tokens = 1", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = 50;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await e7LMarketplace.listItem(mockERC20.address, tokenId, BUY_AMOUNT);

      await mockERC20.connect(add1).approve(e7LMarketplace.address, BUY_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: BUY_AMOUNT }),
      ).to.emit(e7LMarketplace, "ItemBought");
      expect(await mockERC20.connect(add1).balanceOf(add1.address)).equal(50);
      expect(await mockERC721.connect(add1).balanceOf(add1.address)).equal(1);
    });

    it("Buy item with less price send it => Pass if reverted with ERC20: insufficient allowance: Insufficient amount", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = 50;
      const SENDED_AMOUNT = 25;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await e7LMarketplace.listItem(mockERC20.address, tokenId, BUY_AMOUNT);

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, SENDED_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: SENDED_AMOUNT }),
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Buy item with tokenId = notexists => Pass if reverted with NotListed error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = 50;
      const SENDED_AMOUNT = 50;
      const tokenId = 0;

      await mockERC721.approve(e7LMarketplace.address, 1);

      await e7LMarketplace.listItem(mockERC20.address, 1, BUY_AMOUNT);

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, SENDED_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: SENDED_AMOUNT }),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotListed");
    });

    it("Buy item not listed => Pass if reverted", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = 50;
      const SENDED_AMOUNT = 50;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);

      //await e7LMarketplace.listItem(mockERC20.address, tokenId, BUY_AMOUNT);

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, SENDED_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: SENDED_AMOUNT }),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotListed");
    });

    //pago con token nativo porque address = 0x00...
    it("Buy item listed with address(0) => Pass if revert with AddressZeroNotValid error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = ethers.utils.parseEther("50");
      const SENDED_AMOUNT = ethers.utils.parseEther("50");
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);

      await e7LMarketplace.listItem(
        ethers.constants.AddressZero,
        tokenId,
        BUY_AMOUNT,
      );

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, SENDED_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: SENDED_AMOUNT }),
      ).to.be.not.reverted;
    });

    it("Buy item listed with address(0) and less value sended - native token=> Pass if revert with AddressZeroNotValid error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const BUY_AMOUNT = ethers.utils.parseEther("50");
      const SENDED_AMOUNT = ethers.utils.parseEther("25");
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);

      await e7LMarketplace.listItem(
        ethers.constants.AddressZero,
        tokenId,
        BUY_AMOUNT,
      );

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, SENDED_AMOUNT);

      await expect(
        e7LMarketplace.connect(add1).buyItem(tokenId, { value: SENDED_AMOUNT }),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotEnoughAmount");
    });
  });

  describe("Fallback and Receive", function () {
    it("Receive", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = {
        to: e7LMarketplace.address,
        value: ethers.utils.parseEther("1.0"),
      };
      await add1.sendTransaction(tx);
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter.sub(balanceBefore) == ethers.utils.parseEther("1.0"));
    });

    it("Fallback", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = {
        to: e7LMarketplace.address,
        data: ethers.utils.formatBytes32String("Mr. Crypto"),
        value: ethers.utils.parseEther("1.0"),
      };
      await add1.sendTransaction(tx);
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter.sub(balanceBefore) == ethers.utils.parseEther("1.0"));
    });
  });

  describe("Configuration actions", function () {
    it("Set recipient", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await e7LMarketplace.connect(owner).setRecipient(add1.address);

      expect((await e7LMarketplace.Recipient()) == add1.address);
    });

    it("Set marketplace fee", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      await e7LMarketplace.connect(owner).setMarketplaceFee(250);

      expect(
        Number(await e7LMarketplace.connect(owner).MarketplaceFee()) == 250,
      );
    });
  });

  describe("Bid ups actions", function () {
    it("Bidding for an item with an ERC20 token", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const priceListed = 60;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await e7LMarketplace
        .connect(owner)
        .listItem(mockERC20.address, tokenId, priceListed);
      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await expect(
        e7LMarketplace
          .connect(add1)
          .makeBidUp(mockERC20.address, tokenId, priceBidded),
      ).to.emit(e7LMarketplace, "ItemBetted");
    });

    it("Bidding for an item with Native token=> Pass if success", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = ethers.utils.parseEther("1");
      const tokenId = 1;

      await expect(
        e7LMarketplace
          .connect(add1)
          .makeBidUp(ethers.constants.AddressZero, tokenId, priceBidded, {
            value: priceBidded,
          }),
      ).to.emit(e7LMarketplace, "ItemBetted");
    });

    it("Bidding for an item with Native token with less value => Pass if reverted with NotEnoughAmount error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = ethers.utils.parseEther("2");
      const msgValue = ethers.utils.parseEther("1");
      const tokenId = 1;

      await expect(
        e7LMarketplace
          .connect(add1)
          .makeBidUp(ethers.constants.AddressZero, tokenId, priceBidded, {
            value: msgValue,
          }),
      ).to.revertedWithCustomError(e7LMarketplace, "NotEnoughAmount");
    });

    it("Bidding for an item with Native token 2 times => Pass if reverted with ItemBetted error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1, add2 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded1 = ethers.utils.parseEther("50");
      const priceBidded2 = ethers.utils.parseEther("60");
      const tokenId = 1;

      await e7LMarketplace
        .connect(add1)
        .makeBidUp(ethers.constants.AddressZero, tokenId, priceBidded1, {
          value: priceBidded1,
        });

      const balanceBefore = await ethers.provider.getBalance(add1.address);

      await e7LMarketplace
        .connect(add2)
        .makeBidUp(ethers.constants.AddressZero, tokenId, priceBidded2, {
          value: priceBidded2,
        });

      const balanceAfter = await ethers.provider.getBalance(add1.address);
      expect(balanceAfter.sub(balanceBefore) == priceBidded1);
    });

    it("Accept bidding with ERC20 token", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);
      const priceBidded = 50;
      const priceListed = 60;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await e7LMarketplace
        .connect(owner)
        .listItem(mockERC20.address, tokenId, priceListed);
      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await e7LMarketplace
        .connect(add1)
        .makeBidUp(mockERC20.address, tokenId, priceBidded);

      await expect(e7LMarketplace.connect(owner).acceptBidUp(tokenId)).to.emit(
        e7LMarketplace,
        "ItemBetAccepted",
      );
      expect(await mockERC20.connect(add1).balanceOf(add1.address)).equal(50);
      expect(await mockERC721.connect(add1).balanceOf(add1.address)).equal(1);
    });

    it("Accept bidding with Native token", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = ethers.utils.parseEther("1");
      const tokenId = 1;
      const balanceBefore = await ethers.provider.getBalance(owner.address);

      await e7LMarketplace
        .connect(add1)
        .makeBidUp(ethers.constants.AddressZero, tokenId, priceBidded, {
          value: priceBidded,
        });

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await expect(e7LMarketplace.connect(owner).acceptBidUp(tokenId)).to.emit(
        e7LMarketplace,
        "ItemBetAccepted",
      );

      expect((await mockERC721.ownerOf(tokenId)) == add1.address).to.be.true;

      const balanceAfter = await ethers.provider.getBalance(owner.address);
      expect(balanceAfter.sub(balanceBefore) == priceBidded);
    });

    it("Accept bidding of a NTF with any bids => Pass if revert with NotBidded error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const tokenId = 1;

      await expect(
        e7LMarketplace.connect(owner).acceptBidUp(tokenId),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotBidded");
    });

    it("Bidding for an item not approved by nft contract => Pass if reverted with PaymentNotApprovedForMarketplace error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const tokenId = 1;

      await expect(
        e7LMarketplace
          .connect(add1)
          .makeBidUp(mockERC20.address, tokenId, priceBidded),
      ).to.be.revertedWithCustomError(
        e7LMarketplace,
        "PaymentNotApprovedForMarketplace",
      );
    });

    it("Bidding for an item with a lower bid than the current bid => Pass if reverted with LowerThanCurrentBid error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1, add2 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const priceListed = 60;
      const priceBidded2 = 40;
      const tokenId = 1;

      await mockERC721.approve(e7LMarketplace.address, tokenId);
      await e7LMarketplace
        .connect(owner)
        .listItem(mockERC20.address, tokenId, priceListed);
      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await e7LMarketplace
        .connect(add1)
        .makeBidUp(mockERC20.address, tokenId, priceBidded);
      await mockERC20
        .connect(add2)
        .approve(e7LMarketplace.address, priceBidded2);
      await expect(
        e7LMarketplace
          .connect(add2)
          .makeBidUp(mockERC20.address, tokenId, priceBidded2),
      ).to.be.revertedWithCustomError(e7LMarketplace, "LowerThanCurrentBid");
    });

    it("Bidding with a wrong ERC20 => Pass if reverted with PaytokenNotValid error", async function () {
      const {
        e7LMarketplace,
        mockERC20,
        mockERC20_2,
        owner,
        mockERC721,
        add1,
        add2,
      } = await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const priceBidded2 = 55;
      const tokenId = 1;

      await e7LMarketplace.setPaytokenWhitelist(mockERC20_2.address, true);

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await e7LMarketplace
        .connect(add1)
        .makeBidUp(mockERC20.address, tokenId, priceBidded);
      await mockERC20
        .connect(add2)
        .approve(e7LMarketplace.address, priceBidded2);
      await expect(
        e7LMarketplace
          .connect(add2)
          .makeBidUp(mockERC20_2.address, tokenId, priceBidded2),
      ).to.be.revertedWithCustomError(e7LMarketplace, "PaytokenNotValid");
    });

    it("Cancel bidding of a NTF => Pass if reverted with NotOwnerOrAdmin error", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const tokenId = 1;

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await e7LMarketplace
        .connect(add1)
        .makeBidUp(mockERC20.address, tokenId, priceBidded);

      await expect(e7LMarketplace.connect(add1).cancelBid(tokenId)).to.emit(
        e7LMarketplace,
        "ItemBetCanceled",
      );
    });

    it("Cancel bidding of a NTF => Pass if success", async function () {
      const { e7LMarketplace, mockERC20, owner, mockERC721, add1, add2 } =
        await loadFixture(deployE7LMarketPlaceContract);

      const priceBidded = 50;
      const tokenId = 1;

      await mockERC20
        .connect(add1)
        .approve(e7LMarketplace.address, priceBidded);
      await e7LMarketplace
        .connect(add1)
        .makeBidUp(mockERC20.address, tokenId, priceBidded);

      await expect(
        e7LMarketplace.connect(add2).cancelBid(tokenId),
      ).to.be.revertedWithCustomError(e7LMarketplace, "NotOwnerOrAdmin");
    });
  });
});
