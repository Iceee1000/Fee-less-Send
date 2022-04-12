import {Connection, PublicKey, Keypair, Signer} from '@solana/web3.js';
import base58 from 'bs58'

export const TOKEN_FEE= .01;
export const TOKEN_MINT_PUBKEY = new PublicKey('some public key');

const fee_payer_private_key='process.env.privateKey';
let feePayerKeypair: Keypair = Keypair.fromSecretKey(base58.decode(fee_payer_private_key));
export const FEE_PAYER_KEYPAIR: Signer = feePayerKeypair;

export const CONNECTION = new Connection('https://solana-api.projectserum.com', 'confirmed');
    


