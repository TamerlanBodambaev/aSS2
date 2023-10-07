if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    alert('Please install MetaMask or use a Web3-enabled browser.');
}


const contractAddress = '0x1f253ECeaF2EBA2f353B4116C84CC48E28fF355f'; 

const contractAbi = [[
	{
		"inputs": [
			{
				"internalType": "enum RockPaperScissors.Move",
				"name": "move",
				"type": "uint8"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerMoves",
		"outputs": [
			{
				"internalType": "enum RockPaperScissors.Move",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]];

const contract = new web3.eth.Contract(contractAbi, contractAddress);

let playerAddress;

async function updateBalance() {
    const balance = await web3.eth.getBalance(playerAddress);
    document.getElementById('playerBalance').textContent = web3.utils.fromWei(balance, 'ether');
}

async function register() {
    try {
        await contract.methods.register().send({
            from: playerAddress,
            value: web3.utils.toWei('0.0001', 'ether')
        });
        updateBalance();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function play() {
    const move = document.getElementById('move').value;
    try {
        await contract.methods.play(web3.utils.keccak256(move)).send({
            from: playerAddress,
            value: web3.utils.toWei('0.0001', 'ether')
        });
        updateBalance();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function reveal() {
    const clearMove = prompt('Enter your clear move:');
    const password = prompt('Enter your password:');
    try {
        await contract.methods.reveal(clearMove, password).send({
            from: playerAddress
        });
        updateBalance();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getOutcome() {
    try {
        await contract.methods.getOutcome().send({
            from: playerAddress
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateGameStatus() {
}

async function updateGameHistory() {
}

window.addEventListener('load', async () => {
    const accounts = await web3.eth.getAccounts();
    playerAddress = accounts[0];
    document.getElementById('playerAddress').textContent = playerAddress;
    determinePlayerNumber();
    updateBalance();
    updateGameStatus();
    updateGameHistory();
});
