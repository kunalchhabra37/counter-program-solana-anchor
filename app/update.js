const anchor = require("@project-serum/anchor");
const { PublicKey } = require("@solana/web3.js");
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

    // Update RPC call
    const trx = await program.methods.update(new anchor.BN(5)).accounts({
        counterAccount: counterAccountPDA,
        user: provider.wallet.publicKey
    }).signers([]).rpc();

    console.log("Your Account: ", counterAccountPDA.toString(), "trx: ", trx);
}

main();