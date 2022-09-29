const anchor = require('@project-serum/anchor');
const { PublicKey, SystemProgram } = require('@solana/web3.js');
const idl = require('../target/idl/first.json');
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection
const programId = new PublicKey("5giNR2xnzxFebRyX4u4okBRhe3Wr3ntakJWeGVcHMHw1");
const program = new anchor.Program(idl, programId, provider);
// const signer = Uint8Array.from([173,29,155,204,189,17,225,55,46,49,229,195,115,52,195,40,243,243,144,155,213,79,5,88,195,218,144,147,208,229,24,147,159,227,167,131,79,244,90,62,129,111,161,91,221,125,114,158,100,251,145,2,1,20,202,105,97,129,62,22,230,202,254,116]);
const main = async () => {
    const counterAccount = anchor.web3.Keypair.generate();
    console.log(counterAccount.publicKey.toString())
    // let trx = await program.methods.create().account({
    //         counterAccount: counterAccount.publicKey,
    //         user: provider.wallet.publicKey,
    //         systemProgram: SystemProgram.programId
    // }).signers([provider.wallet]).rpc();
    // let trx = await program.methods.create().accounts({
    //     accounts:{
    //         counterAccount: counterAccount.publicKey,
    //         user: provider.wallet.publicKey,
    //         systemProgram: SystemProgram.programId
    //     },
    //     signers: [provider.wallet, counterAccount]
    // }).rpc();
    let trx = await program.methods.create().accounts({
        accounts:{
                    counterAccount: counterAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId
                },
                signers: [provider.wallet, counterAccount]
    }).rpc()
    // console.log(provider.wallet.publicKey.toString());
    console.log('acc:', counterAccount);
    console.log(trx);
}
main();