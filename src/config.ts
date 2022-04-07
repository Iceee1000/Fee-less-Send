import {Connection, PublicKey, Keypair, Signer} from '@solana/web3.js';
import base58 from 'bs58'

export const TOKEN_FEE= .01;
export const TOKEN_MINT_PUBKEY = new PublicKey('GV6n9Uow3XzMWSs8vwTCML8SvMA6ozbidaEfdPoSoraQ');

const fee_payer_private_key='3WT5kx6C7N6fBfFwuNP9Mum3bjEtADsZUFBzdcqwAnkX4vSiMuNjAHY1eH51jjR2Tsv8m1mUf2Bz4jN8kqWaruBY';
let feePayerKeypair: Keypair = Keypair.fromSecretKey(base58.decode(fee_payer_private_key));
export const FEE_PAYER_KEYPAIR: Signer = feePayerKeypair;

export const CONNECTION = new Connection('https://solana-api.projectserum.com', 'confirmed');
    


