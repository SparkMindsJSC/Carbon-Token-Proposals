
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

`PRIVATE_KEY`

Private key of address account owner will deploy smart contract

## Run Locally

#### Need clean & compile smart contract after each change
```bash
   npx hardhat clean
   npx hardhat compile
```
### Smart contract deployment order
#### 1. Smart contract Token
   Using tokens for exchange, token holders have many benefits such as staking, rewards and can participate in voting for system decisions.
#### 2. Smart contract Timelock
   Prevents immediate changes to decisions after voting, setting a time period for decisions to wait until they are implemented.
#### 3. Smart contract CarbonGovernor
   Build a decentralized governance mechanism, create proposals for construction and development decisions, and decisions approved through the community.
## Running Tests

To run tests, run the following command

```bash
  npx hardhat test 
```


## 🌏Deployment
Deployment smart contract in manta network testnet

### Need compile smart contract 
```bash
  npx hardat compile
```

#### To deploy smart contract token 

```bash
  npx hardhat run --network manta scripts/deploy-token.ts
```

#### To deploy smart contract airdrop 

```bash
  npx hardhat run --network manta scripts/deploy-airdrop.ts
```


