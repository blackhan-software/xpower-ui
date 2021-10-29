import { ellipse } from "../ellipse";

export class Message {
    static minting(amount: number, nonce: string): string {
        return `Minting ${amount} XPOW token(s) [for ${ellipse(nonce)}]…`;
    }
    static minted(amount: number, nonce: string): string {
        return `Minted ${amount} XPOW token(s) [for ${ellipse(nonce)}].`;
    }
}
export default Message;
