// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SafePayEscrow {
    address public owner;

    // FUNDED=0, RELEASED=1, REFUNDED=2
    // Removed PENDING so FUNDED=0 — matches blockchain.ts
    enum EscrowStatus {
        FUNDED,
        RELEASED,
        REFUNDED
    }

    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        uint256 createdAt;
        EscrowStatus status;
    }

    mapping(bytes32 => Escrow) private _escrows;

    event EscrowCreated(
        string indexed orderId,
        bytes32 indexed key,
        address indexed buyer,
        address seller,
        uint256 amount
    );

    event PaymentReleased(
        string indexed orderId,
        bytes32 indexed key,
        address indexed seller,
        uint256 sellerAmount,
        uint256 fee
    );

    event PaymentRefunded(
        string indexed orderId,
        bytes32 indexed key,
        address indexed buyer,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Pure helper: orderId string => storage key
    function orderKey(string memory orderId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(orderId));
    }

    // Signature required to prevent fake escrows
    function createEscrow(
        string memory orderId,
        address seller,
        bytes memory sig
    ) external payable {
        bytes32 key = orderKey(orderId);
        require(_escrows[key].buyer == address(0), "Escrow already exists");
        require(msg.value > 0, "Must send ETH");
        require(seller != address(0), "Invalid seller address");

        _verifySig(orderId, seller, msg.value, sig);

        _escrows[key] = Escrow({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            createdAt: block.timestamp,
            status: EscrowStatus.FUNDED
        });

        emit EscrowCreated(orderId, key, msg.sender, seller, msg.value);
    }

    // Owner (backend) releases after OTP confirmed
    function releasePayment(string memory orderId) external onlyOwner {
        bytes32 key = orderKey(orderId);
        Escrow storage e = _escrows[key];
        require(e.buyer != address(0), "Escrow does not exist");
        require(e.status == EscrowStatus.FUNDED, "Not in funded state");

        e.status = EscrowStatus.RELEASED;
        (bool ok, ) = payable(e.seller).call{value: e.amount}("");
        require(ok, "ETH transfer to seller failed");

        emit PaymentReleased(orderId, key, e.seller, e.amount, 0);
    }

    // Owner (admin) refunds buyer on dispute
    function refundBuyer(string memory orderId) external onlyOwner {
        bytes32 key = orderKey(orderId);
        Escrow storage e = _escrows[key];
        require(e.buyer != address(0), "Escrow does not exist");
        require(e.status == EscrowStatus.FUNDED, "Not in funded state");

        e.status = EscrowStatus.REFUNDED;
        (bool ok, ) = payable(e.buyer).call{value: e.amount}("");
        require(ok, "ETH refund to buyer failed");

        emit PaymentRefunded(orderId, key, e.buyer, e.amount);
    }

    // Read helpers
    function getEscrow(string memory orderId) external view returns (Escrow memory) {
        return _escrows[orderKey(orderId)];
    }

    function getEscrowByKey(bytes32 key) external view returns (Escrow memory) {
        return _escrows[key];
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Internal: verify backend signature
    // Must match signCreateEscrow() in blockchain.ts exactly
    function _verifySig(
        string memory orderId,
        address seller,
        uint256 amount,
        bytes memory sig
    ) internal view {
        bytes32 rawHash = keccak256(abi.encodePacked(orderId, seller, amount));
        bytes32 ethHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", rawHash)
        );
        address signer = _recoverSigner(ethHash, sig);
        require(signer == owner, "Invalid signature");
    }

    function _recoverSigner(
        bytes32 hash,
        bytes memory sig
    ) internal pure returns (address) {
        require(sig.length == 65, "Bad sig length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        if (v < 27) v += 27;
        return ecrecover(hash, v, r, s);
    }

    receive() external payable {}

    fallback() external payable {}
}
