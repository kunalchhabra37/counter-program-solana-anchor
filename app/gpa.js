const anchor = require("@project-serum/anchor");
const { PublicKey } = require("@solana/web3.js");
const idl = require("../target/idl/first.json");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const programId = new PublicKey("3fg4A32dEzRjuh9fEgrXWYqhi2Xy8RdYn5SWH2eNso8v");

const main = async () => {
    const accounts = await connection.getProgramAccounts(programId);
    // console.log(accounts);\
    accounts.forEach((acc)=> {
        console.log(acc.pubkey.toString());
    })
}
main()