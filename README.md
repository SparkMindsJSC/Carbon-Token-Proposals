# ✴️Carbon token proposals

Deploy smart contract for system storage carbon certificate

👉 Using hardhat & openzeplin version 5.0 deploy for this project

## 🔧Installation

Install this project with yarn

```bash
  yarn install
```

## ✔️Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PRIVATE_KEY_OWNER`
`PRIVATE_KEY_SUBMITTER`

Private key of address account owner will deploy smart contract and an account submitter evidence.

## Run Locally

#### Need clean & compile smart contract after each change

```bash
   npx hardhat clean
   npx hardhat compile
```

### Smart contract deployment order

#### 1. Smart contract Token

Using tokens for exchange, token holders have many benefits such as staking, rewards and can participate in voting for system decisions.
Constructor deploy smart contract:

- Owner smart conntract
- Supply token
- Tax point 0-10000 (1% = 100)
- Address pool

#### 2. Smart contract Timelock

Prevents immediate changes to decisions after voting, setting a time period for decisions to wait until they are implemented.

- minDelay (Time need wait to implement)
- Address proposer[]
- Addrees executtor[]

#### 3. Smart contract CarbonGovernor

Build a decentralized governance mechanism, create proposals for construction and development decisions, and decisions approved through the community.

- Address of token wrapped by ERC20Votes.
- Address of smart contract Timelock execute.

#### 4. Smart contract EvidenceStorage

Store and retrieve evidence and evidence submission address information on the blockchain.

- Address owner smart contract.

#### 5. Smart contract EvidenceValidator

Check the validity of evidences and distribute rewards.

- Address token.
- Address smart contract evidence storage.

## Running Tests

To run tests, run the following command

#### Open terminal and run rpc hardhat node for local

```bash
  npx hardhat node
```

👉 Copy the entire address and secret key displayed on the terminal for use.

###### ❗❗ keep terminal until you don't want to use local node

#### Open new terminal Start test with hardhat

```bash
  npx hardhat test
```

## 🌏Deployment

Deployment smart contract in manta network testnet

### Need compile smart contract

```bash
  npx hardat compile
```

#### To deploy smart contract

##### Manta Network Testnet

```bash
  npx hardhat run --network manta scripts/deploy.ts
```

##### Sepolia Network Testnet

```bash
  npx hardhat run --network sepolia scripts/deploy.ts
```

### This is address smart contracts deployed

#### Check in Sepolia scan at here: <https://sepolia.etherscan.io/>

- tokenAddress = "0x3F75E56495a31db40EaE9E29ceF3DaeC18fd7f83";
- timeLockAddress = "0x57e95b2e4Dfa01323a1F15db48d6A90e497c895D";
- evidenceStorageAddress = "0x57799ACbC4a1Fd531f702682ad5B0b6355d0451A";
- governorAddress = "0x7b723e8698BE2B35001Abc7CCF3FF33A9521c908";
- evidenceValidateAddress = "0xC0bd5B5069eF1f6Ef7093776cc8b5c071adFcC65";
