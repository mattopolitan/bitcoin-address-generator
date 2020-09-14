import React from 'react';
import {FormMessage, Select, Button, DoneSVGIcon} from 'react-md';
import ReeValidate from 'ree-validate'
import pubkey_validate from "../validators/rules/pubkey_validate";

import ChipInput from 'material-ui-chip-input';

let NUMBER_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

ReeValidate.Validator.extend('pubkey_validate', {
    validate: (value, { compare }) => {
        return pubkey_validate({value, compare, validationType: ''});
    },
    params: ['compare'],
    message: ''
});

class FormMultiSig extends React.Component{
    constructor(props) {
        super(props)

        this.validator = new ReeValidate.Validator({
            pubkeys: 'required|pubkey_validate',
            n: 'required|integer',
        })

        this.state = {
            formData: {
                pubkeys: [],
                n: 0,
            },
            errors: this.validator.errors,
        }

        this.handleUpdateN = this.handleUpdateN.bind(this)
        this.handleUpdatePubkeys = this.handleUpdatePubkeys.bind(this)
        this.validateAndSubmit = this.validateAndSubmit.bind(this)
    }

    handleUpdateN(_n){
        const { errors } = this.validator

        errors.remove('n')

        this.setState({ formData: { ...this.state.formData, ['n']: _n } })

        this.validator.validate('n', _n)
            .then(() => {
                this.setState({ errors })
            })
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
    }

    submit(formData) {
        if(this.state.errors.items.length === 0)
            this.props.handleFormData(formData)
    }

    render() {
        const { errors } = this.state
        const disabled = errors.items.length !== 0 || this.state.formData.pubkeys.length === 0 || this.state.formData.n === 0

        return (<form id="form-multisig" className={'form'} onSubmit={this.validateAndSubmit}>
            <div className="row">
                <div className="col-xs-4">
                    <div className="col-xs-4">
                        <Button id="outlined-button-1" theme="primary" themeType="contained" type="submit" disabled={disabled}>
                            {disabled ? '' : <DoneSVGIcon />}
                            Generate your <br className={'mobile-visible'} /> Bitcoin Address!
                        </Button>
                    </div>
                </div>
            </div>
            <div className={"row"}>
                Type your Public Keys and press Enter<br />
                (Support up to 15 keys)<br /><br />
                <ChipInput
                    name={'pubkeys'}
                    onChange={(pubkeys) => this.handleUpdatePubkeys(pubkeys)}
                    type="pubkeys"
                />
                <FormMessage id={`pubkeys-field-error-message`} error>
                    {
                        errors.has('pubkeys') ?
                            "Invalid Public Key exists! Make sure it's a 33 byte compressed Public Key!"
                        : ""
                    }
                </FormMessage>
            </div>
            <div className="row">
                <Select
                    id="custom-select-1"
                    name="n"
                    options={NUMBER_ITEMS.slice(0,this.state.formData.pubkeys.length)}
                    onChange={(n) => this.handleUpdateN(n)}
                    label={`n-of-${this.state.formData.pubkeys.length}`}
                    value={this.state.formData.n}
                    type="n"
                    required
                    error={errors.has('n')}
                    disabled={this.state.formData.pubkeys.length === 0}
                />
            </div>

        </form>)
    }
}

export default FormMultiSig;