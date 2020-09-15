import * as bip39 from "bip39";
import * as hdkey from "hdkey";
import * as bitcoin from "bitcoinjs-lib";

export async function getRootFromMnemonic(_mnemonic){
    const seed = await bip39.mnemonicToSeed(_mnemonic)
    const root = hdkey.fromMasterSeed(seed)

    return root
}

export function getPriKeyFromRoot(_root){
    return _root.privateKey.toString('hex')
}

export function getHDSegwitFromRootWithPath(_root, _path){
    const addrnode = _root.derive(_path)
    const publicKey = addrnode._publicKey

    return {
        pubKey: publicKey.toString('hex'),
        pubAddress: bitcoin.payments.p2wpkh({ pubkey: publicKey }).address
    }
}

export function getMultiSigAddress(_pubkeys, _n){
    let pubkeys = _pubkeys.map(hex => Buffer.from(hex, 'hex'));
    return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: parseInt(_n), pubkeys }),
    }).address;
}