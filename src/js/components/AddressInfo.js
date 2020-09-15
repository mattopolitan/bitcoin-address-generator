import React from 'react';
import {Button, Switch, ContentCopySVGIcon} from 'react-md';
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
        const {path, mnemonic, HDSegwit, multiSigAddress, n, pubkeys} = this.state.info
        let qrcode, detail

        if(this.state.form === 'hd-segwit'){
            qrcode = <QRCode value={HDSegwit.pubAddress} size={128}/>
            detail = <div>
                <div className="detail">
                    <div className={"row"} >
                        <div className={'title'}>Address</div>
                        <CopyToClipboard text={HDSegwit.pubAddress}>
                            <div className={"bitcoin-address"} onClick={()=> {
                                    let el = document.getElementById('pop-message');
                                    el.style.WebkitTransition = 'opacity 0s'
                                    el.style.transition = 'opacity 0s'
                                    el.style.opacity = '1';
                                    setTimeout(()=>{
                                        el.style.WebkitTransition = 'opacity .5s'
                                        el.style.transition = 'opacity .5s'
                                        el.style.opacity = '0';
                                    },100)
                                }
                            }>
                                <span className={'copy-to-clipboard tooltip'}>
                                        {HDSegwit.pubAddress}
                                    {/*<span className="tooltiptext">Click to copy!</span>*/}
                                    <span id="pop-message">Copied!</span>
                                </span>
                                <ContentCopySVGIcon />
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Wallet Format</div>
                        <div>HD Native Segwit</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Mnemonic Seed</div>
                        <div className={'mnemonic'}>{mnemonic}</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Path</div>
                        <div>{path}</div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"disclaimer"}>
                        Do not share your Mnemonic Seed! <br />
                        Make a backup!
                    </div>
                </div>
            </div>
        }
        if(this.state.form === 'multi-sig'){
            qrcode = <QRCode value={multiSigAddress} size={128}/>
            detail = <div>
                <div className="detail">
                    <div className={"row"} >
                        <div className={'title'}>Address</div>
                        <CopyToClipboard text={multiSigAddress} >
                            <div className={"bitcoin-address"}>
                                <span className={'copy-to-clipboard tooltip'}>
                                        {multiSigAddress}
                                    <span className="tooltiptext">Click to copy!</span>
                                </span>
                                <ContentCopySVGIcon />
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Wallet Format</div>
                        <div>{n}-of-{pubkeys.length} MultiSig P2SH</div>
                    </div>
                    <div className={"row"}>
                        <div className={'title'}>Associated Public Keys</div>
                        <div className={'public-keys'}>{pubkeys.map( (el, index) => {return <div>{index + 1}. {el}</div>} )}</div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"disclaimer"}>
                        Make a backup!
                    </div>
                </div>
            </div>
        }
        
        return <div>
            <div className={`address-info ${this.state.form}`}>
                <div className="qr-code-container">
                    Address QR Code <br /><br />
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