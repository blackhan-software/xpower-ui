import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Address, Amount, Token } from '../../../source/redux/types';
import { NftWallet, OnApproval, Wallet } from '../../../source/wallet';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MID_UINT256 = 2n ** 255n - 1n;

$('#connect-metamask').on('connected', async function checkAllowance(ev, {
    address
}: {
    address: Address
}) {
    const wallet = new Wallet(address);
    const wallet_nft = new NftWallet(address);
    const allowance = await wallet.allowance(
        address, wallet_nft.contract.address
    );
    const $approval = $('#burn-approval');
    if (MID_UINT256 > allowance) {
        $approval.prop('disabled', false);
        $approval.show();
    } else {
        $approval.prop('disabled', true);
        $approval.hide();
    }
    const $minter = $('#batch-minter');
    if (MID_UINT256 > allowance) {
        $minter.prop('disabled', true);
        $minter.removeClass('full');
    } else {
        App.onTokenChanged(function toggleMinter(
            token: Token, { amount }: { amount: Amount }
        ) {
            $minter.prop('disabled', amount === 0n);
        });
        $minter.addClass('full');
        const amount = await wallet.balance;
        $minter.prop('disabled', amount === 0n);
    }
});
$('#burn-approval').on('click', async function increaseAllowance() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const wallet = new Wallet(address);
    const wallet_nft = new NftWallet(address);
    const old_allowance = await wallet.allowance(
        address, wallet_nft.contract.address
    );
    const $approval = $('#burn-approval');
    if (MAX_UINT256 > old_allowance) {
        const on_approval: OnApproval = (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            $approval.trigger('approved');
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            wallet.onApproval(on_approval);
            tx = await wallet.increaseAllowance(
                wallet_nft.contract.address,
                MAX_UINT256 - old_allowance
            );
        } catch (ex) {
            $approval.trigger('error', {
                error: ex
            });
            console.error(ex);
        }
    } else {
        $approval.trigger('approved');
    }
});
