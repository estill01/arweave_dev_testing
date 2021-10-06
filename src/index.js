
import Arweave from 'arweave';

const arweave = Arweave.init({
    host: 'arweave.net',
    protocol: 'https',
    port: 443
});




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
