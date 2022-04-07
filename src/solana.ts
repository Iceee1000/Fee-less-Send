import {  
  Connection, 
  Signer,  
  PublicKey, 
  Transaction, 
  TransactionSignature, 
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';
import { getOrCreateAssociatedTokenAccount} from '@solana/spl-token';
import {TOKEN_FEE, TOKEN_MINT_PUBKEY, CONNECTION} from './config';


//Sends tokens and takes TOKEN_FEE as a fee
//Solana fee is payed by FEE_PAYER_KEYPAIR
//Token fee is sent from from_keypair<Signer> to FEE_PAYER_KEYPAIR<Signer>
//@Returns array of two transaction signatures [token transaction, token fee tranaction]
export const send_with_fee = async (
    from_keypair: Signer, 
    to_pubkey: PublicKey, 
    amount: number,
    fee_payer: Signer,
    
    ): Promise<any> => {
  
    try{
      let signature = basic_send(
      from_keypair, //from Signer
      to_pubkey, //to PublicKey
      amount-TOKEN_FEE, //token amount
      TOKEN_MINT_PUBKEY, //PublicKey of the token mint
      fee_payer, //The fee payer
      CONNECTION //Connection
    );
  
    let signature2 = basic_send(
      from_keypair, //from Signer
      fee_payer.publicKey, //to PublicKey
      TOKEN_FEE, //token amount
      TOKEN_MINT_PUBKEY, //PublicKey of the token mint
      fee_payer, //The fee payer
      CONNECTION //Connection
    );  
      
    let signatures = [signature, signature2]

    const promises = await Promise.allSettled(signatures);

    const results = promises.filter((res) => res.status === 'fulfilled') as PromiseFulfilledResult<any>[];

    return  [results[0] ? results[0].value : 'transaction not confirmed', results[1] ? results[1].value : 'transaction not confirmed']; //checks whether each signature exists or is undefined. returns signature if exists

    }catch(e){
      console.log(e)
      throw 'Transaction error';
    }
    
  }
  

  //Basic function to send Token. 
  export const basic_send = async (
    from_keypair: Signer, //sender keypair
    to_pubkey: PublicKey, //PublicKey of receiver
    amount: number, //amount of tokens to send
    mintAddress: PublicKey, //mint address publickey for token
    fee_payer_keypair: Signer, //payer of the transaction fee
    connection: Connection
  ): Promise<TransactionSignature | undefined> => {
     
      //get sender token account (will throw error if sender does not have token account)
      const fromTokenAccount_account = await connection.getTokenAccountsByOwner(from_keypair.publicKey, {mint: mintAddress});
    
      //get or create token account for reciever (paid for by fee_payer_keypair)
      const toTokenAccount_account = await getOrCreateAssociatedTokenAccount(
        connection,
        fee_payer_keypair,
        mintAddress,
        to_pubkey
      );
  
      
      //building the token transaction
      let transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount_account.value[0].pubkey, // token account PublicKey of the sender
          toTokenAccount_account.address, //token account PublicKey of the receiver
          from_keypair.publicKey, // Token account owner PublicKey (sender public key)
          amount*10**9, 
          [],
          TOKEN_PROGRAM_ID, //TOKEN PROGRAM ID FROM @solana/spl-token
        ),
      );
  
      var signers = (fee_payer_keypair == from_keypair) ? [from_keypair]: [fee_payer_keypair, from_keypair];
        
      //transaction signature returned in string form
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        signers, //Signers: first signer listed will pay the transaction fee. Sender also required to sign to authorize transaction in case sender is not fee-payer.
        {commitment: 'processed', maxRetries: 5} //experimenting with these options... faster transactions can be acheived with commitment: 'processed' but there is a chance transaction gets dropped after receiving signature.
        
      );  
       
      return signature ? signature : undefined; 
  };

  
  module.exports={
    send_with_fee,
    basic_send,
  }