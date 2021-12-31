import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Address, Amount } from '../../../source/redux/types';
import { NftLevel, NftLevels } from '../../../source/redux/types';
import { NftWallet, OnTransferBatch, Wallet } from '../../../source/wallet';

import './allowance';
import './approval';

$('#batch-minter').on('click', async function batchMintNfts() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nfts = [] as Array<{ level: NftLevel; amount: Amount; }>;
    for (const level of NftLevels()) {
        const $nft_minter = $(`.nft-minter[data-level=${NftLevel[level]}]`);
        const amount = BigInt($nft_minter.find('.amount').text());
        if (amount > 0) {
            nfts.push({ level: level, amount });
        }
    }
    const levels = nfts.map((nft) => nft.level);
    const amounts = nfts.map((nft) => nft.amount);
    const on_batch_tx: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        $minter.trigger('minted');
    };
    const $minter = $('#batch-minter');
    const wallet = new NftWallet(address);
    let tx: Transaction | undefined;
    try {
        $minter.trigger('minting');
        wallet.onTransferBatch(on_batch_tx);
        tx = await wallet.mintBatch(levels, amounts);
    } catch (ex) {
        $minter.trigger('error', {
            error: ex
        });
        console.error(ex);
    }
});
$('#connect-metamask').on('connected', function toggleMinter(ev, {
    address
}: {
    address: Address
}) {
    const $minter = $('#batch-minter');
    $minter.on('minting', () => {
        $minter.prop('disabled', true);
    });
    $minter.on('minted', async () => {
        const wallet = new Wallet(address);
        const balance = await wallet.balance;
        $minter.prop('disabled', balance === 0n);
    });
    $minter.on('error', async () => {
        $minter.prop('disabled', false);
    });
    const $approval = $('#burn-approval');
    $approval.on('approved', async () => {
        const wallet = new Wallet(address);
        const balance = await wallet.balance;
        $minter.prop('disabled', balance === 0n);
        $minter.addClass('full');
    });
    $approval.on('error', () => {
        $minter.prop('disabled', true);
        $minter.removeClass('full');
    });
});
$('#connect-metamask').on('connected', function toggleMinterSpinner() {
    const $minter = $('#batch-minter');
    const $text = $minter.find('.text');
    const $spinner = $minter.find('.spinner');
    $minter.on('minting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Batch Minting NFTs…');
    });
    $minter.on('minted', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Batch Mint NFTs');
    });
    $minter.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Batch Mint NFTs');
    });
});
