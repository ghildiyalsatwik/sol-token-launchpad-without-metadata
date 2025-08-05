import { TokenLaunchpad } from "./components/TokenLaunchpad"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import "@solana/wallet-adapter-react-ui/styles.css"
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState } from "react"

function App() {

  const [mintAddress, setMintAddress] = useState("")

  return (

    <ConnectionProvider endpoint = {"https://api.devnet.solana.com"}>

      <WalletProvider wallets = {[]} autoConnect>

        <WalletModalProvider>

          {mintAddress === "" && <div>

            <WalletMultiButton></WalletMultiButton>

            <WalletDisconnectButton></WalletDisconnectButton>

          </div>

          }

          <TokenLaunchpad mintAddress = {mintAddress} setMintAddress = {setMintAddress}></TokenLaunchpad>

        </WalletModalProvider>

      </WalletProvider>

    </ConnectionProvider>

  )
}

export default App
