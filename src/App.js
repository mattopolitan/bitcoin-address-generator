import React from 'react';
import FormHDSegwit from './js/components/FormHDSegwit';
import FormMultiSig from './js/components/FormMultiSig';
import AddressInfo from './js/components/AddressInfo';
import {getRootFromMnemonic, getHDSegwitFromRootWithPath, getPriKeyFromRoot, getMultiSigAddress} from './js/utils/utils';
import {Switch} from 'react-md';

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
        this.setState({
          info: {
            ...this.state.info,
            pubkeys: _formData.pubkeys,
            n: _formData.n,
          }
        }, async () => {
          try{
            let result = await getMultiSigAddress(_formData.pubkeys, _formData.n)

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
        })
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
          <a className="github-icon" href="https://github.com/mattopolitan/bitcoin-address-generator" data-hotkey="g d" aria-label="Homepage "
             data-ga-click="Header, go to dashboard, icon:logo">
            <svg className="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1"
                 width="32" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>
    );
  }
}

export default App;
