// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NotOwner();
error TokenIdNotValid();
error PayTokenAddressNotValid();
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error AlreadyListed(uint tokenId);
error NotListed(uint tokenId);
error NotEnoughAmount(uint tokenId, uint price);
error LowerThanCurrentBid(uint currentBid);
error PaymentNotApprovedForMarketplace();
error NotBidded();
error CanNotBidWithNative();
error PaytokenNotValid();
error NotOwnerOrAdmin();

contract E7LMarketplace is ReentrancyGuard, Ownable {
  struct Listing {
    address paytoken;
    uint price;
    address seller;
  }

  struct Bid {
    address paytoken;
    uint priceBid;
    address bidder;
  }

  event ItemListed(
    address indexed seller,
    uint256 indexed tokenId,
    address paytoken,
    uint256 price,
    string modified_listed
  );
  event ItemCanceled(address indexed seller, uint256 indexed tokenId);
  event ItemBought(
    address buyer,
    uint tokenId,
    address paytoken,
    uint price,
    uint collectionRoyaltyFee
  );
  event ItemBetted(address buyer, uint tokenId, address paytoken, uint bid);
  event ItemBetAccepted(
    address buyer,
    uint tokenId,
    address paytoken,
    uint bid,
    address seller
  );
  event ItemBetCanceled(
    address buyer,
    uint tokenId,
    address paytoken,
    uint bid
  );

  mapping(uint => Listing) public listings;
  mapping(uint => Bid) public bids;
  mapping(address => bool) paytokensWhitelist;
  uint public MarketplaceFee = 200; //1%
  address payable public Recipient;
  address public nftAddress;

  modifier isListed(uint256 tokenId) {
    Listing memory listing = listings[tokenId];
    if (listing.price == 0) {
      revert NotListed(tokenId);
    }
    _;
  }

  modifier notListed(uint256 tokenId) {
    Listing memory listing = listings[tokenId];
    if (listing.price > 0) {
      revert AlreadyListed(tokenId);
    }
    _;
  }

  modifier isOwner(uint tokenId, address nftOwner) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (owner != nftOwner) {
      revert NotOwner();
    }
    _;
  }

  modifier isTokenIdValid(uint tokenId) {
    if (tokenId == 0) {
      revert TokenIdNotValid();
    }
    _;
  }

  modifier isPaytokenValid(address paytokenAddress) {
    if (
      paytokensWhitelist[paytokenAddress] != true &&
      paytokenAddress != address(0)
    ) {
      revert PayTokenAddressNotValid();
    }
    _;
  }

  constructor(address _nftAddress) {
    nftAddress = _nftAddress;
    Recipient = payable(msg.sender);
  }

  /////////////////////
  // Main Functions //
  /////////////////////
  /*
   * @notice Method for listing NFT
   * @param paytoken Address of the token in which is going to be paid
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */
  function listItem(
    address paytoken,
    uint tokenId,
    uint price
  )
    external
    notListed(tokenId)
    isTokenIdValid(tokenId)
    isOwner(tokenId, msg.sender)
    isPaytokenValid(paytoken)
  {
    if (price == 0) {
      revert PriceMustBeAboveZero();
    }

    IERC721 nft = IERC721(nftAddress);

    if (nft.getApproved(tokenId) != address(this)) {
      revert NotApprovedForMarketplace();
    }
    listings[tokenId] = Listing(paytoken, price, msg.sender);
    emit ItemListed(msg.sender, tokenId, paytoken, price, "ItemListed");
  }

  /*
   * @notice Method for cancelling listing
   * @param tokenId Token ID of NFT
   */
  function cancelListing(
    uint tokenId
  ) external isListed(tokenId) isOwner(tokenId, msg.sender) {
    delete (listings[tokenId]);
    emit ItemCanceled(msg.sender, tokenId);
  }

  /*
   * @notice Method for updating listing
   * @param paytoken Address of the token in which is going to be paid
   * @param tokenId Token ID of NFT
   * @param newPrice Price in Wei of the item
   */
  function modifyItem(
    address paytoken,
    uint tokenId,
    uint price
  )
    external
    isTokenIdValid(tokenId)
    isListed(tokenId)
    nonReentrant
    isOwner(tokenId, msg.sender)
    isPaytokenValid(paytoken)
  {
    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }
    listings[tokenId].price = price;
    listings[tokenId].paytoken = paytoken;
    emit ItemListed(msg.sender, tokenId, paytoken, price, "ModifyItem");
  }

  /*
   * @notice Method for buying a NFT
   * @param tokenId Token ID of NFT
   */
  function buyItem(
    uint tokenId
  ) external payable isListed(tokenId) nonReentrant {
    Listing memory listing = listings[tokenId];
    uint collectionRoyaltyFee = (listing.price * MarketplaceFee) / 10000;

    // Native token payment
    if (listing.paytoken == address(0)) {
      if (msg.value < listing.price) {
        revert NotEnoughAmount(tokenId, listing.price);
      }
      Recipient.transfer(collectionRoyaltyFee);
      payable(listing.seller).transfer(listing.price - collectionRoyaltyFee);
    } else {
      // ERC20 token payment
      IERC20(listing.paytoken).transferFrom(
        msg.sender,
        Recipient,
        collectionRoyaltyFee
      );

      IERC20(listing.paytoken).transferFrom(
        msg.sender,
        listing.seller,
        listing.price - collectionRoyaltyFee
      );
    }

    delete (listings[tokenId]);

    //Trasfer nft
    IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);

    emit ItemBought(
      msg.sender,
      tokenId,
      listing.paytoken,
      listing.price,
      collectionRoyaltyFee
    );
  }

  /*
   * @notice Method for making a bid
   * @param paytoken Address of the token in which is going to be paid
   * @param tokenId Token ID of NFT
   * @param bid Bid price of the item
   */
  function makeBidUp(
    address paytoken,
    uint tokenId,
    uint bidPrice
  ) external payable isPaytokenValid(paytoken) {
    Bid memory bid = bids[tokenId];
    if (bid.bidder != address(0) && bid.paytoken != paytoken) {
      revert PaytokenNotValid();
    }
    if (bidPrice <= bid.priceBid) {
      revert LowerThanCurrentBid(bid.priceBid);
    }

    if (paytoken == address(0)) {
      if (msg.value <= bid.priceBid || msg.value != bidPrice) {
        revert NotEnoughAmount(tokenId, msg.value);
      }
      if (bid.bidder != address(0)) {
        // require(
        //   address(msg.sender).balance > bid.priceBid,
        //   "Not enought balance on contract"
        // );
        payable(bid.bidder).transfer(bid.priceBid);
      }
    } else {
      // ERC20 token payment
      IERC20 token = IERC20(paytoken);
      if (token.allowance(msg.sender, address(this)) < bidPrice) {
        revert PaymentNotApprovedForMarketplace();
      }
    }
    bids[tokenId].bidder = msg.sender;
    bids[tokenId].paytoken = paytoken;
    bids[tokenId].priceBid = bidPrice;

    emit ItemBetted(msg.sender, tokenId, paytoken, bidPrice);
  }

  /*
   * @notice Method for accepting a bid
   * @param tokenId Token ID of NFT
   */
  function acceptBidUp(uint tokenId) external onlyOwner {
    if (bids[tokenId].bidder == address(0)) {
      revert NotBidded();
    }
    uint collectionRoyaltyFee = (bids[tokenId].priceBid * MarketplaceFee) /
      10000;

    if (bids[tokenId].paytoken == address(0)) {
      // payable(msg.sender).transfer(
      //   bids[tokenId].priceBid - collectionRoyaltyFee
      // );
      (bool success, ) = payable(msg.sender).call{
        value: (bids[tokenId].priceBid - collectionRoyaltyFee)
      }("");
      require(success, "Transfer failed");
    } else {
      // ERC20 token payment
      IERC20(bids[tokenId].paytoken).transferFrom(
        bids[tokenId].bidder,
        Recipient,
        collectionRoyaltyFee
      );

      IERC20(bids[tokenId].paytoken).transferFrom(
        bids[tokenId].bidder,
        msg.sender,
        bids[tokenId].priceBid - collectionRoyaltyFee
      );
    }
    //Trasfer nft
    IERC721(nftAddress).safeTransferFrom(
      msg.sender,
      bids[tokenId].bidder,
      tokenId
    );

    emit ItemBetAccepted(
      bids[tokenId].bidder,
      tokenId,
      bids[tokenId].paytoken,
      bids[tokenId].priceBid,
      msg.sender
    );
    delete (bids[tokenId]);
  }

  /*
   * @notice Method for cancel a bid
   * @param tokenId Token ID of NFT
   */
  function cancelBid(uint tokenId) public {
    if (msg.sender != bids[tokenId].bidder) {
      revert NotOwnerOrAdmin();
    }
    emit ItemBetCanceled(
      bids[tokenId].bidder,
      tokenId,
      bids[tokenId].paytoken,
      bids[tokenId].priceBid
    );
    delete (bids[tokenId]);
  }

  /*
   * @notice Method for updating the paytokens availables
   * @param paytokenAddress Address of the paytoken to modify
   * @param paytokenStatus Status of the paytoken
   */
  function setPaytokenWhitelist(
    address paytokenAddress,
    bool paytokenStatus
  ) public onlyOwner {
    require(paytokenAddress != address(0), "Token address not valid");

    paytokensWhitelist[paytokenAddress] = paytokenStatus;
  }

  /*
   * @notice Method for updating the marketplace fee
   * @param _newFee New fee for the marketplace
   */
  function setMarketplaceFee(uint _newFee) external onlyOwner {
    MarketplaceFee = _newFee;
  }

  /*
   * @notice Method for updating the recipient of the marketplace fees
   * @param _newRecipient Address for the recipient for the marketplace
   */
  function setRecipient(address _newRecipient) external onlyOwner {
    Recipient = payable(_newRecipient);
  }

  receive() external payable {
    (bool success, ) = Recipient.call{value: msg.value}("");
    require(success, "");
  }

  fallback() external payable {
    (bool success, ) = Recipient.call{value: msg.value}("");
    require(success, "");
  }
}
