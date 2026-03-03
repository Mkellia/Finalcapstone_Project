export default {
	"abi": [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_arbiter",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_feeRecipient",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "oldArbiter",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newArbiter",
						"type": "address"
					}
				],
				"name": "ArbiterChanged",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					},
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "EscrowCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "oldBps",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "newBps",
						"type": "uint256"
					}
				],
				"name": "FeeUpdated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "oldOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Paused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					},
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "PaymentRefunded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					},
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "sellerAmount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					}
				],
				"name": "PaymentReleased",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Unpaused",
				"type": "event"
			},
			{
				"stateMutability": "payable",
				"type": "fallback"
			},
			{
				"inputs": [],
				"name": "ESCROW_TIMEOUT",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "MAX_FEE_BPS",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "RELEASE_THRESHOLD",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "arbiter",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					}
				],
				"name": "claimTimeout",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "sig",
						"type": "bytes"
					}
				],
				"name": "createEscrow",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "feeBps",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "feeRecipient",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getBalance",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					}
				],
				"name": "getEscrow",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "buyer",
								"type": "address"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "createdAt",
								"type": "uint256"
							},
							{
								"internalType": "enum SafePayEscrow.EscrowStatus",
								"name": "status",
								"type": "uint8"
							}
						],
						"internalType": "struct SafePayEscrow.Escrow",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					}
				],
				"name": "getEscrowByKey",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "buyer",
								"type": "address"
							},
							{
								"internalType": "address",
								"name": "seller",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "createdAt",
								"type": "uint256"
							},
							{
								"internalType": "enum SafePayEscrow.EscrowStatus",
								"name": "status",
								"type": "uint8"
							}
						],
						"internalType": "struct SafePayEscrow.Escrow",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					}
				],
				"name": "orderKey",
				"outputs": [
					{
						"internalType": "bytes32",
						"name": "",
						"type": "bytes32"
					}
				],
				"stateMutability": "pure",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "pause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "paused",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					}
				],
				"name": "refundBuyer",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					}
				],
				"name": "releasePayment",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newArbiter",
						"type": "address"
					}
				],
				"name": "setArbiter",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "newFeeBps",
						"type": "uint256"
					}
				],
				"name": "setFeeBps",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newRecipient",
						"type": "address"
					}
				],
				"name": "setFeeRecipient",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "unpause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"stateMutability": "payable",
				"type": "receive"
			}
		]
};
