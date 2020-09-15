import React from 'react';
import FormHDSegwit from './js/components/FormHDSegwit';
import FormMultiSig from './js/components/FormMultiSig';
import AddressInfo from './js/components/AddressInfo';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import {Switch} from 'react-md';

async function getRootFromMnemonic(_mnemonic){
  const seed = await bip39.mnemonicToSeed(_mnemonic)
  const root = hdkey.fromMasterSeed(seed)

  return root
}

function getPriKeyFromRoot(_root){
  return _root.privateKey.toString('hex')
}

function getHDSegwitFromRootWithPath(_root, _path){
  const addrnode = _root.derive(_path)
  const publicKey = addrnode._publicKey

  return {
    pubKey: publicKey.toString('hex'),
    pubAddress: bitcoin.payments.p2wpkh({ pubkey: publicKey }).address
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        mnemonic: '',
        masterPriKey: '',
        path: "m/84'/0'/0'/0/0",
        HDSegwit: '',
        pubkeys: [],
        n: 1,
        multiSigAddress: '',
      },
      view: 'form',
      form: 'hd-segwit'
    };
    this.handleFormData = this.handleFormData.bind(this)
    this.changeView = this.changeView.bind(this)
    this.changeForm = this.changeForm.bind(this)
  }

  handleFormData(_formData){

    if(this.state.form === 'hd-segwit'){
      this.setState({
        info: { 
          ...this.state.info, 
          path: _formData.path,
          mnemonic: _formData.seed,
        }
      }, async () => {
        const root = await getRootFromMnemonic(this.state.info.mnemonic)
        const HDSegwit = await getHDSegwitFromRootWithPath(root, this.state.info.path)
        this.setState({
          info: { 
            ...this.state.info, 
            masterPriKey: await getPriKeyFromRoot(root),
            HDSegwit: HDSegwit,
          }
        })
        this.changeView('result')
      });
    }

    if(this.state.form === 'multi-sig'){
      const pubkeys = _formData.pubkeys.map(hex => Buffer.from(hex, 'hex'));
      this.setState({
        info: { 
          ...this.state.info, 
          pubkeys: _formData.pubkeys,
          n: _formData.n
        }
      }, () => {
        try{
          let result = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2ms({ m: parseInt(this.state.info.n), pubkeys }),
          }).address;
  
          this.setState({
            info: { 
              ...this.state.info, 
              multiSigAddress: result,
            }
          })
        }catch (e) {
          console.log(e)
        }

        this.changeView('result')
      });
    }
  }

  changeView(_view){
    this.setState({
      view: _view
    })
  }

  // Toggle form
  changeForm(){
    let _form = this.state.form === 'hd-segwit' ? 'multi-sig' : 'hd-segwit'
    this.setState({
      form: _form
    })
  }

  render() {
    let view

    if (this.state.view === 'form') {
      if (this.state.form === 'hd-segwit') {
        view = <FormHDSegwit handleFormData={this.handleFormData} />
      }
      if (this.state.form === 'multi-sig') {
        view = <FormMultiSig handleFormData={this.handleFormData} />
      }
    }
    if (this.state.view === 'result') {
        view = <AddressInfo info={this.state.info} form={this.state.form}/>
    }

    return (
        <div className="App">
          <header className="App-header">
            <a onClick={() => this.changeView('form')}> 
              <img src={`./images/bitcoin.png`} className="App-logo" alt="logo" />
            </a>
          </header>
          <div id={'view-container'}>
            {(this.state.view === 'form') ?
              <div className="switch">
                <div>HD Segwit Wallet</div>
                <div>
                  <Switch id="switch-1" name="switch" label="MultiSig Wallet" onChange={() => this.changeForm()} defaultChecked={ (this.state.form === 'multi-sig') ? true : false}/>
                </div>
              </div>
            : ""}
            {view}
          </div>
        </div>
    );
  }
}

export default App;
