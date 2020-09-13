import React from 'react';
import {TextField, FormMessage, TextArea, Select, Button, DoneSVGIcon} from 'react-md';
import ReeValidate from 'ree-validate'
import pubkey_validate from "../validators/rules/pubkey_validate";

import ChipInput from 'material-ui-chip-input';

let NUMBER_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

ReeValidate.Validator.extend('pubkey_validate', {
    validate: (value, { compare }) => {
        return pubkey_validate({value, compare, validationType: ''});
    },
    params: ['compare', 'dateType'],
    message: 'The selected date must not be earlier than {dateType}'
});

class FormMultiSig extends React.Component{
    constructor(props) {
        super(props)

        this.validator = new ReeValidate.Validator({
            pubkeys: 'required|pubkey_validate',
            m: 'required|integer',
        })

        this.state = {
            formData: {
                pubkeys: [],
                m: 0,
            },
            errors: this.validator.errors,
        }

        this.validateAndSubmit = this.validateAndSubmit.bind(this)
        this.handleUpdatePubkeys = this.handleUpdatePubkeys.bind(this)
        this.handleUpdateM = this.handleUpdateM.bind(this)
    }

    handleUpdateM(_m){
        const { errors } = this.validator

        errors.remove('m')

        this.setState({ formData: { ...this.state.formData, ['m']: _m } })

        this.validator.validate('m', _m)
            .then(() => {
                this.setState({ errors })
            })
    }

    submit(formData) {
        if(this.state.errors.items.length == 0)
            this.props.handleFormData(formData)
    }

    handleUpdatePubkeys(_pubkeys){
        const { errors } = this.validator

        errors.remove('pubkeys')

        this.setState({ formData: { ...this.state.formData, ['pubkeys']: _pubkeys } })

        this.validator.validate('pubkeys', _pubkeys)
            .then(() => {
                this.setState({ errors })
            })

    }

    async validateAndSubmit(e) {
        e.preventDefault()

        const { formData } = this.state
        const { errors } = this.validator

        const valid = this.validator.validateAll(formData)

        if (valid) {
            this.submit(formData)
        } else {
            this.setState({ errors }, console.log(errors))
        }

        // const pubkeys = this.state.pubkeys.map(hex => Buffer.from(hex, 'hex'));
        //
        // let result = bitcoin.payments.p2sh({
        //     redeem: bitcoin.payments.p2ms({ m: parseInt(this.state.m), pubkeys }),
        // }).address;
        //
        // console.log('result',result)
    }

    render() {
        const { errors } = this.state
        const disabled = errors.items.length != 0 || this.state.formData.pubkeys.length == 0 || this.state.formData.m == 0

        return (<form id="form-multisig" className={'form'} onSubmit={this.validateAndSubmit}>
            <div className="row">
                <div className="col-xs-4">
                    <div className="col-xs-4">
                        {/*<button className="btn btn-block bg-pink waves-effect" type="submit">Generate</button>*/}
                        <Button id="outlined-button-1" theme="primary" themeType="contained" type="submit" disabled={disabled}>
                            {/*<TextIconSpacing icon={<DoneSVGIcon />}>*/}
                            {/*    Generate your Bitcoin Address!*/}
                            {/*</TextIconSpacing>*/}
                            {disabled ? '' : <DoneSVGIcon />}
                            Generate your <br className={'mobile-visible'} /> Bitcoin Address!
                        </Button>
                    </div>
                </div>
            </div>
            <div className={"row"}>

                <ChipInput
                    name={'pubkeys'}
                    defaultValue={[
                          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
                          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
                          '03c6103b3b83e4a24a0e33a4df246ef22442f9992663db1c9f759a5e2ebf68d8e9',
                          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
                    ]}
                    onChange={(pubkeys) => this.handleUpdatePubkeys(pubkeys)}
                    type="pubkeys"
                />
                <FormMessage id={`pubkeys-field-error-message`} error>
                    {
                        errors.has('pubkeys') ?
                                "Invalid Public Key exists!"
                            : ""
                    }
                </FormMessage>
            </div>
            <div className="row">
                <Select
                    id="custom-select-1"
                    name="m"
                    options={NUMBER_ITEMS.slice(0,this.state.formData.pubkeys.length)}
                    onChange={(m) => this.handleUpdateM(m)}
                    label={'n-out-of-m'}
                    value={this.state.formData.m}
                    type="m"
                    placeholder="Enter your m"
                    required
                    error={errors.has('m')}
                />
            </div>

        </form>)
    }
}

export default FormMultiSig;