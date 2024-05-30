import { ethers } from 'ethers';
import { createWeb3Modal } from '@web3modal/ethereum';
import { configureChains, createConfig } from '@wagmi/core';
import { walletConnectProvider, publicProvider } from '@wagmi/core/providers';
import { mainnet, arbitrum } from '@wagmi/core/chains';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { InjectedConnector } from '@wagmi/core/connectors/injected';

const projectId = 'YOUR_PROJECT_ID'; // Replace with your actual project ID from WalletConnect Cloud

const { chains, publicClient } = configureChains(
  [mainnet, arbitrum],
  [walletConnectProvider({ projectId }), publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false } }),
    new InjectedConnector({ chains })
  ],
  publicClient
});

const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  enableAnalytics: true // Optional
});

document.getElementById('connect-button').addEventListener('click', async () => {
  await web3Modal.open();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  document.getElementById('wallet-info').innerHTML = `
    <p>Connected Account: ${address}</p>
    <p>Network: ${network.name}</p>
  `;
});
