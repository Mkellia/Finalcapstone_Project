// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SafePayEscrow {
    address public admin;

    enum State { AWAITING_DELIVERY, COMPLETE, REFUNDED }

    struct Escrow {
        address payable buyer;
        address payable seller;
        uint256 amount;
        State state;
    }

    mapping(string => Escrow) public escrows;

    event EscrowCreated(string orderId, address buyer, address seller, uint256 amount);
    event PaymentReleased(string orderId, address seller, uint256 amount);
    event BuyerRefunded(string orderId, address buyer, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createEscrow(string memory orderId, address payable seller) external payable {
        require(msg.value > 0, "Must send ETH");
        require(escrows[orderId].amount == 0, "Escrow exists");

        escrows[orderId] = Escrow({
            buyer: payable(msg.sender),
            seller: seller,
            amount: msg.value,
            state: State.AWAITING_DELIVERY
        });

        emit EscrowCreated(orderId, msg.sender, seller, msg.value);
    }

    function releasePayment(string memory orderId) external {
        Escrow storage e = escrows[orderId];
        require(msg.sender == e.buyer || msg.sender == admin, "Not authorized");
        require(e.state == State.AWAITING_DELIVERY, "Invalid state");

        e.state = State.COMPLETE;
        uint256 amount = e.amount;
        e.amount = 0;
        e.seller.transfer(amount);

        emit PaymentReleased(orderId, e.seller, amount);
    }

    function refundBuyer(string memory orderId) external onlyAdmin {
        Escrow storage e = escrows[orderId];
        require(e.state == State.AWAITING_DELIVERY, "Invalid state");

        e.state = State.REFUNDED;
        uint256 amount = e.amount;
        e.amount = 0;
        e.buyer.transfer(amount);

        emit BuyerRefunded(orderId, e.buyer, amount);
    }

    function getEscrow(string memory orderId) external view returns (
        address, address, uint256, State
    ) {
        Escrow memory e = escrows[orderId];
        return (e.buyer, e.seller, e.amount, e.state);
    }
}