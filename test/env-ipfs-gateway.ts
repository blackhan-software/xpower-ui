export function ipfs_gateway(key = 'IPFS_GATEWAY') {
    const tld = process.env[key];
    if (!tld) {
        throw new Error(`missing ${key}`);
    }
    return tld;
}
export default ipfs_gateway;
