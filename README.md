# Coin Exchange DaPP - TokenFarm

TokenFarm is an ehtereum based decentralized bank exchange dapp where investors can stake the DAI tokens and get rewards from staking those tokens as DaPP Tokens.

# Start Client
`` npm start ``

# Migrate Contract
make sure your ganache is running before trying to migrate your contract

`` truffle migrate --reset ``

# Setup MetaMask
- connect your MetaMask to Ganache 
- copy the private key of 2nd account from ganace accounts
- import that account (2nd) to your MetaMask wallet
- make sure the account is conneced with our application


# Reward
`` truffle exec scripts/issue-tokens.js ``

the above command will issue the DaPP tokens (*Reward*) to stakers.




