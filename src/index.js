
import Arweave from 'arweave';

// Don't need to specify this in newer versions of the package,
// but doing so here for learning
const arweave = Arweave.init({
    host: 'arweave.net',
    protocol: 'https',
    port: 443
});

// this won't work -- need to provide `wallet` and `contractSource`
async function createContract() {
    // Create the contract transaction
    const contractTx = await arweave.createTransaction(
        { data: contractSource },
        wallet
    );
    contractTx.addTag('App-Name', 'SmartWeaveContractSource');
    contractTx.addTag('App-Version', '0.1.0');
    contractTx.addTag('Content-Type', 'application/javascript');

    // Sign transaction
    await arweave.transactions.sign(contractTx, wallet);

    // Let's keep the ID, it will be used in the state transaction
    const constractSourceTxId = contractTx.id;

    // Deploy the contract source
    await arweave.transactions.post(contractTx);


    // Now, let's create the Initial State transaction
    const initialStateTx = await arweave.createTransaction(
        { data: initialState },
        wallet
    )
    initialStateTx.addTag('App-Name', 'SmartWeaveContractSource');
    initialStateTx.addTag('App-Version', '0.1.0');
    initialStateTx.addTag('Contract-Src', contractSourceTxId);
    initialStateTx.addTag('Content-Type', 'application/json');

    // Sign transaction
    await arweave.transactions.sign(initialStateTx, wallet);
    const initialStateTxId = initialStateTx.id;

    // Deploy
    await arweave.transactions.post(initialStateTx);
}
createContract();


export function handle(state, action) {
    const balances = state.balances;
    const input = action.input;
    const caller = action.caller;

    if (input.function === 'increment') {
        // If the caller already has a key of balances, increment,
        // otherwise, set it to 1
        if (caller in balances) {
            balances[caller]++;
        } else {
            balances[caller] = 1;
        }
    }
}
