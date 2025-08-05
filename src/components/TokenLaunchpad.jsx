import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from '@solana/spl-token'

export function TokenLaunchpad({ mintAddress, setMintAddress }) {

    const { connection } = useConnection()

    const wallet = useWallet()

    async function createToken() {

        try {

            const mintKeypair = Keypair.generate()

            const lamports = await getMinimumBalanceForRentExemptMint(connection)

            const transaction = new Transaction().add(

                SystemProgram.createAccount({

                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID
                }),

                createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_2022_PROGRAM_ID)
            )

            transaction.feePayer = wallet.publicKey

            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash 

            transaction.partialSign(mintKeypair)

            try {
                
                await wallet.sendTransaction(transaction, connection)

                setMintAddress(mintKeypair.publicKey.toBase58())

                console.log(`Token created at ${mintKeypair.publicKey.toBase58()}`)

            } catch(err) {

                alert("Transaction failed! Please try again.")
            }

        } catch(err) {

            console.log("Error in create token function")
        }

    }

    function goBackToLaunchpad() {

        setMintAddress("")
    }

    return (

        <div>

            {mintAddress === "" && <div>
                
                <h1>Solana Token Launchpad</h1>

                <button onClick={createToken} disabled = {!wallet.connected} title = {!wallet.connected ? "Connect your wallet first!" : ""}>
                    
                    Launch your token
                
                </button>
                
            </div>}

            {mintAddress !== "" && <div>
                
                <div>Your token was created at address: {mintAddress}</div>

                <br></br>

                <button onClick = {goBackToLaunchpad}>Create More!</button>

            </div>}

        </div>
    )
}