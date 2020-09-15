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
        </div>
    );
  }
}

export default App;
