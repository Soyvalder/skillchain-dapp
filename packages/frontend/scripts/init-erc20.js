// ESM script to initialize the deployed ERC-20 Stylus contract
// Usage (PowerShell):
//   $env:RPC_URL='https://rpc.ankr.com/arbitrum_sepolia'
//   $env:PRIVATE_KEY='<0x...>'
//   node scripts/init-erc20.js "SkillToken" "SKL" 18 1000000

import { ethers } from 'ethers';

async function main() {
  const [name, symbol, decimalsStr, supplyMillionsStr] = process.argv.slice(2);
  if (!process.env.PRIVATE_KEY) throw new Error('Missing PRIVATE_KEY in environment');
  const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/arbitrum_sepolia';

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const erc20Abi = (await import('../src/contracts/ERC20.json', { assert: { type: 'json' } })).default;
  const deployment = (await import('../src/contracts/erc20.deployment.json', { assert: { type: 'json' } })).default;

  const address = deployment.address;
  if (!address) throw new Error('ERC20 address not set in erc20.deployment.json');

  const decimals = decimalsStr ? Number(decimalsStr) : 18;
  const supplyMillions = supplyMillionsStr ? Number(supplyMillionsStr) : 1;
  const supply = ethers.parseUnits(String(supplyMillions * 1_000_000), decimals);

  const contract = new ethers.Contract(address, erc20Abi, wallet);
  console.log('Initializing contract at', address);
  const tx = await contract.initialize(
    name || 'SkillToken',
    symbol || 'SKL',
    decimals,
    supply,
    wallet.address,
  );
  console.log('Sent initialize tx:', tx.hash);
  const receipt = await tx.wait();
  console.log('Initialize confirmed in block', receipt.blockNumber);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});