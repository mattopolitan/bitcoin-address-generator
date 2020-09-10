import React from 'react';
import {TextField, FormMessage, TextArea, Select, Button, DoneSVGIcon} from 'react-md';
import ReeValidate from 'ree-validate'
import classnames from 'classnames'
import seed_validate from "../validators/rules/seed_validate";
import path_validate from "../validators/rules/path_validate";

import ChipInput from 'material-ui-chip-input';
import * as bitcoin from "bitcoinjs-lib";

let NUMBER_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

ReeValidate.Validator.extend('seed_validate', {
    validate: (value, { compare }) => {
        return seed_validate({value, compare, validationType: ''});
    },
    params: ['compare', 'dateType'],
    message: 'The selected date must not be earlier than {dateType}'
});

ReeValidate.Validator.extend('path_validate', {
    validate: (value, { compare }) => {
        return path_validate({value, compare, validationType: ''});
    },
    params: ['compare', 'dateType'],
    message: 'The selected date must not be earlier than {dateType}'
});

class FormMultiSig extends React.Component{
    constructor(props) {
        super(props)

        this.validator = new ReeValidate.Validator({
            seed: 'required|seed_validate',
            path: 'required|path_validate',
        })

        this.state = {
            formData: {
                seed: '',
                path: '',
            },
            chips: [],
            number: 0,
            errors: this.validator.errors,
        }

        this.onChange = this.onChange.bind(this)
        this.validateAndSubmit = this.validateAndSubmit.bind(this)
        this.handleUpdateChips = this.handleUpdateChips.bind(this)
    }

    onChange(e) {
        // const name = e.target.name
        // const value = e.target.value
        // const { errors } = this.validator
        //
        // // reset errors for url field
        // errors.remove(name)
        //
        // // update form data
        // this.setState({ formData: { ...this.state.formData, [name]: value } })
        //
        // this.validator.validate(name, value)
        //     .then(() => {
        //         this.setState({ errors })
        //     })
        this.setState({
            number: e
        })

    }

    submit(formData) {
        formData.m = this.state.number
        formData.pubkeys = this.state.chips
        this.props.handleFormData(formData)
    }

    handleUpdateChips(_chips){

        this.setState({
            chips: _chips
        }, () => console.log(this.state.chips))

    }

    async validateAndSubmit(e) {
        e.preventDefault()

        const { formData } = this.state
        const { errors } = this.validator

        const valid = this.validator.validateAll(formData)

        if (valid) {
            this.submit(formData)
        } else {
            this.setState({ errors })
        }

        // const pubkeys = this.state.chips.map(hex => Buffer.from(hex, 'hex'));
        //
        // let result = bitcoin.payments.p2sh({
        //     redeem: bitcoin.payments.p2ms({ m: parseInt(this.state.number), pubkeys }),
        // }).address;
        //
        // console.log('result',result)
    }

    render() {
        const { errors } = this.state
        const disabled = errors.items.length != 0 || this.state.chips.length == 0 || this.state.number == 0

        return (<form id="generate-address" onSubmit={this.validateAndSubmit}>
            <br />
            <div className="row">
                <div className="col-xs-4">
                    <div className="col-xs-4">
                        {/*<button className="btn btn-block bg-pink waves-effect" type="submit">Generate</button>*/}
                        <Button id="outlined-button-1" theme="primary" themeType="contained" type="submit" disabled={disabled}>
                            {/*<TextIconSpacing icon={<DoneSVGIcon />}>*/}
                            {/*    Generate your Bitcoin Address!*/}
                            {/*</TextIconSpacing>*/}
                            {disabled ? '' : <DoneSVGIcon />}
                            Generate your Bitcoin Address!
                        </Button>
                    </div>
                </div>
            </div>
            <div id={"generate-address-container"}>

                <ChipInput
                    defaultValue={[
                          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
                          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
                          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
                          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
                    ]}
                    onChange={(chips) => this.handleUpdateChips(chips)}
                />

                <Select
                    id="custom-select-1"
                    options={NUMBER_ITEMS.slice(0,this.state.chips.length)}
                    onChange={this.onChange}
                    label={'n-out-of-m'}
                    value={this.state.number}
                    // onChange={handleChange}
                    // disableMovementChange={disableMovementChange}
                />
            </div>

        </form>)
    }
}

export default FormMultiSig;