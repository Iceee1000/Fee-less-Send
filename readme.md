Fee-less sending

setup:
clone repo and add to project or copy files solana.ts & config.ts files to project

check/modify config.ts options

import function send_with_fee from solana.ts


example send: 
```
const signatures=await send_with_fee(
    senderKeypair, //Keypair of wallet that will send the tokens
    toPublicKey, //PublicKey of wallet that will receive the tokens
    amount, //amount of tokens to send
    FEE_PAYER_KEYPAIR //Keypair of wallet that will pay the transaction fee
    )

console.log(signatures) //outputs [signature of token transaction, signature of a token fee transaction paid from sender to fee-payer]

```
