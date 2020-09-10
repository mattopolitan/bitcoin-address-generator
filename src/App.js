import React from 'react';
import Form from './js/components/Form';
import FormMultiSig from './js/components/FormMultiSig';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import {Button} from 'react-md';
import QRCode from 'qrcode.react';

async function getSeed(_mnemonic){
  const result = await bip39.mnemonicToSeed(_mnemonic)
  const root = hdkey.fromMasterSeed(result);
  const masterPrivateKey = root.privateKey.toString('hex');
  console.log('masterPrivateKey: ' + masterPrivateKey);
  const masterPublicKey = root.publicKey;

  // Public Key in native segwit
  console.log('segwitMasterPublicKey: ' + bitcoin.payments.p2wpkh({ pubkey: masterPublicKey }).address)
  return result
}

const testValues = [
    'veteran common receive uphold humble target fall black math play long frost',
    "m/44'/0'/0'/0/0",
]

async function generateRandomMasterRoot(){
  const mnemonic = bip39.generateMnemonic() //generates string
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const root = hdkey.fromMasterSeed(seed)

  return root;

  const masterPrivateKey = root.privateKey.toString('hex')
  const masterPublicKey = root.publicKey
  const path = "m/84'/0'/0'/0/0"
  const addrnode = root.derive(path);
  const publicKey = addrnode._publicKey;
  const HDSegwit = bitcoin.payments.p2wpkh({ pubkey: publicKey }).address;

  return {
    masterPrivateKey: masterPrivateKey,
    HDSegwit: HDSegwit
  }

}

async function getRootFromMnemonic(_mnemonic){
  const seed = await bip39.mnemonicToSeed(_mnemonic)
  const root = hdkey.fromMasterSeed(seed)

  return root;
}

function getPriKeyFromRoot(_root){
  return _root.privateKey.toString('hex')
}

function getHDSegwitFromRootWithPath(_root, _path){
  const addrnode = _root.derive(_path);
  const publicKey = addrnode._publicKey;

  return {
    pubKey: publicKey.toString('hex'),
    pubAddress: bitcoin.payments.p2wpkh({ pubkey: publicKey }).address
  }

}

function Test() {
  let segwitAddress, multiAddress

  // Create Seed
  const mnemonic = bip39.generateMnemonic(); //generates string
  const seed = getSeed(mnemonic); //creates seed buffer
  // const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer

  const root = hdkey.fromMasterSeed(seed);
  const masterPrivateKey = root.privateKey.toString('hex');
  // console.log('masterPrivateKey: ' + masterPrivateKey);

  const masterPublicKey = root.publicKey;
  console.log('masterPublicKey: ' + bitcoin.payments.p2wpkh({ pubkey: masterPublicKey }).address);

  const path = "m/44'/0'/0'/0/0"

  const addrnode = root.derive(path);
  // console.log('addrnodePublicKey: '+ addrnode._publicKey)

  const step1 = addrnode._publicKey;
  // console.log('addrnodePublicKey: ' + bitcoin.payments.p2wpkh({ pubkey: step1 }).address);

  const HDSegwit = bitcoin.payments.p2wpkh({ pubkey: step1 }).address;

  // const step2 = createHash('sha256').update(step1).digest();
  // const step3 = createHash('rmd160').update(step2).digest();
  //
  // var step4 = Buffer.allocUnsafe(21);
  // step4.writeUInt8(0x00, 0);
  // step3.copy(step4, 1); //step4 now holds the extended RIPMD-160 result
  // const step9 = bs58check.encode(step4);
  // console.log('Base58Check: ' + step9);

  // Generate segwit address
  // const keyPair = bitcoin.ECPair.fromWIF(
  //     'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn',
  // );
  // console.log(`Public Key: ${keyPair.publicKey}`)
  // console.log(`Private Key: ${keyPair.privateKey}`)
  // segwitAddress = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }).address;

  // Generate n-m multi-sig p2sh address
  const pubkeys = [
    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
  ].map(hex => Buffer.from(hex, 'hex'));

  multiAddress = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
  }).address;

  return (
    <div className="App">
      <header className="App-header">
        <img src={`./images/bitcoin.png`} className="App-logo" alt="logo" />
        <p>
          {`Master Private Key: ${masterPrivateKey}`}
        </p>
        <p>
          {`Path: ${path}`}
        </p>
        <p>
           {`HDSegwit Address: ${HDSegwit}`}
        </p>
        {/*<p>*/}
        {/*   {`Segwit: ${segwitAddress}`}*/}
        {/*</p>*/}
        <p>
          {`Multi-sig P2SH address: ${multiAddress}`}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: 'veteran common receive uphold humble target fall black math play long frost',
      masterPriKey: '',
      path: "m/84'/0'/0'/0/0",
      HDSegwit: '',
      pubkeys: [],
      m: 1,
      multiAddress: '',
      view: 'form',
      form: 'multisig'
    };
    this.handleFormData = this.handleFormData.bind(this)
    this.changeView = this.changeView.bind(this)
  }

  handleFormData(_formData){

    if(this.state.form === 'hd-segwit'){
      this.setState({
        path: _formData.path,
        mnemonic: _formData.seed
      }, async () => {
        const root = await getRootFromMnemonic(this.state.mnemonic)
        const HDSegwit = await getHDSegwitFromRootWithPath(root, this.state.path)

        this.setState({
          masterPriKey: await getPriKeyFromRoot(root),
          HDSegwit: HDSegwit,
        })

        this.changeView('result')
      });
    }

    if(this.state.form === 'multisig'){
      const pubkeys = _formData.pubkeys.map(hex => Buffer.from(hex, 'hex'));
      this.setState({
        pubkeys: pubkeys,
        m: _formData.m
      },  () => {

        let result = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2ms({ m: parseInt(this.state.m), pubkeys }),
        }).address;

        this.setState({
          multiAddress: result,
        })

        this.changeView('result')
      });
    }

  }

  changeView(_view){
    this.setState({
      view: _view
    })
  }

  async componentDidMount() {
    // const root = await generateRandomMasterRoot()
    // const root = await getRootFromMnemonic(this.state.mnemonic)
    // const HDSegwit = await getHDSegwitFromRootWithPath(root, this.state.path)
    //
    // this.setState({
    //   masterPriKey: await getPriKeyFromRoot(root),
    //   HDSegwit: HDSegwit,
    //   // multiAddress: multiAddress
    // })

  }

  render() {
    const { masterPriKey, masterPublicKey, path, HDSegwit, HDSegwitPubKey, multiAddress } = this.state

    let view
    if (this.state.view === 'form') {
      if (this.state.form === 'hd-segwit') {
        view = <Form handleFormData={this.handleFormData} />
      }
      if (this.state.form === 'multisig') {
        view = <FormMultiSig handleFormData={this.handleFormData} />
      }
    }
    if (this.state.view === 'result') {
      view = <div>
        <p>
          {`Master Private Key: ${masterPriKey}`}
        </p>
        <p>
          HDSegwit<br />
          {`Path: ${path}`}<br />
          {`Address: ${HDSegwit.pubAddress}`}<br />
          {`Public Key: ${HDSegwit.pubKey}`}
        </p>
        <p>
          {`Multi-sig P2SH address: ${multiAddress}`}
          <QRCode value={multiAddress} size={128}/>
        </p>
        <div className="row">
          <div className="col-xs-4">
            <Button id="outlined-button-1" theme="primary" themeType="outline" onClick={() => this.changeView('form')}>
              Back
            </Button>
          </div>
        </div>
      </div>
    }


    return (
        <div className="App">
          <header className="App-header">
            <img src={`./images/bitcoin.png`} className="App-logo" alt="logo" />
          </header>
          <div id={'view-container'}>
            {view}
          </div>
        </div>
    );
  }
}

export default App;
