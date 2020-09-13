import React from 'react';
import {Button, Switch} from 'react-md';
import QRCode from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class AddressInfo extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            info: this.props.info,
            form: this.props.form
        }

    }

    render() {

        const {path, mnemonic, HDSegwit, multiAddress, m, pubkeys} = this.state.info
        let qrcode, detail
        if(this.state.form == 'hd-segwit'){
            qrcode = <QRCode value={HDSegwit.pubAddress} size={128}/>
            detail = <div>
                <div className="detail">
                    <div className={"row"} >
                        <div className={'title'}>Address</div>
                        <CopyToClipboard text={HDSegwit.pubAddress} >
                            <div className={"bitcoin-address"}>
                                <span className={'copy-to-clipboard tooltip'}>
                                        {HDSegwit.pubAddress}
                                    <span class="tooltiptext">Click to copy!</span>
                                </span>
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Format</div>
                        <div>HD Segwit</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Seed Mnemonic</div>
                        <div>{mnemonic}</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Path</div>
                        <div>{path}</div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"disclaimer"}>Do not share your Seed Mnemonic! Make a backup!</div>
                </div>
            </div>
        }
        if(this.state.form == 'multisig'){
            qrcode = <QRCode value={multiAddress} size={128}/>
            detail = <div>
                <div className="detail">
                    <div className={"row"} >
                        <div className={'title'}>Address</div>
                        <CopyToClipboard text={multiAddress} >
                            <div className={"bitcoin-address"}>
                                <span className={'copy-to-clipboard tooltip'}>
                                        {multiAddress}
                                    <span class="tooltiptext">Click to copy!</span>
                                </span>
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Format</div>
                        <div>Multi-Sign</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>m</div>
                        <div>{m}</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Public Keys</div>
        <div>{pubkeys.map( (el, index) => {return <div>{index + 1}. {el}</div>} )}</div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"disclaimer"}>Do not share your Seed Mnemonic! Make a backup!</div>
                </div>
            </div>
        }
        
        return <div>
            <div className="address-info">
                <div className="qr-code-container">
                    Wallet QR Code <br /><br />
                    {qrcode}
                </div>
                <div className="detail-container">
                    {detail}
                </div>
            </div>
            <Button id="outlined-button-1" className="btn-print" theme="primary" themeType="outline" onClick={() => window.print()}>
                Print YOUR WALLET
            </Button>
        </div>
    }
}

export default AddressInfo;