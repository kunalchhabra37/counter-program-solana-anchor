const anchor = require("@project-serum/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

const idl = require("../target/idl/first.json");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const programId = new PublicKey("3fg4A32dEzRjuh9fEgrXWYqhi2Xy8RdYn5SWH2eNso8v");
const program = new anchor.Program(idl, programId, provider);

const main = async () => {

    // Get PDA 
    const [counterAccountPDA, _] = await PublicKey.findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("counter-account"),
            provider.wallet.publicKey.toBuffer()
        ],
        program.programId
    );

    // Call RPC method create
    let trx = await program.methods.create().accounts({
                    counterAccount: counterAccountPDA,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
    }).signers([]).rpc()

    console.log("Your Account: ", counterAccountPDA.toString(), "\n trx: ", trx);
}
main();