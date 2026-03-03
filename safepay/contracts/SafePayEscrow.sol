// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SafePayEscrow {
    address public owner;

    enum EscrowStatus { PENDING, FUNDED, RELEASED, REFUNDED }

    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        EscrowStatus status;
        string orderId;        // links to your DB order UUID
    }

    mapping(string => Escrow) public escrows;  // orderId => Escrow
    mapping(string => bool)   public exists;

    event EscrowCreated(string orderId, address buyer, address seller, uint256 amount);
    event PaymentReleased(string orderId, address seller, uint256 amount);
    event PaymentRefunded(string orderId, address buyer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier escrowExists(string memory orderId) {
        require(exists[orderId], "Escrow does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Buyer calls this with ETH value to lock funds
    function createEscrow(
        string memory orderId,
        address seller
    ) external payable {
        require(!exists[orderId], "Escrow already exists");
        require(msg.value > 0, "Must send ETH");
        require(seller != address(0), "Invalid seller");

        escrows[orderId] = Escrow({
            buyer:   msg.sender,
            seller:  seller,
            amount:  msg.value,
            status:  EscrowStatus.FUNDED,
            orderId: orderId
        });
        exists[orderId] = true;

        emit EscrowCreated(orderId, msg.sender, seller, msg.value);
    }

    // Only owner (backend) can release after OTP confirmed
    function releasePayment(string memory orderId)
        external
        onlyOwner
        escrowExists(orderId)
    {
        Escrow storage e = escrows[orderId];
        require(e.status == EscrowStatus.FUNDED, "Not in funded state");

        e.status = EscrowStatus.RELEASED;
        (bool ok, ) = payable(e.seller).call{value: e.amount}("");
        require(ok, "ETH transfer to seller failed");

        emit PaymentReleased(orderId, e.seller, e.amount);
    }

    // Only owner (admin) can refund buyer
    function refundBuyer(string memory orderId)
        external
        onlyOwner
        escrowExists(orderId)
    {
        Escrow storage e = escrows[orderId];
        require(e.status == EscrowStatus.FUNDED, "Not in funded state");

        e.status = EscrowStatus.REFUNDED;
        (bool ok, ) = payable(e.buyer).call{value: e.amount}("");
        require(ok, "ETH refund to buyer failed");

        emit PaymentRefunded(orderId, e.buyer, e.amount);
    }

    function getEscrow(string memory orderId)
        external
        view
        returns (Escrow memory)
    {
        return escrows[orderId];
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
