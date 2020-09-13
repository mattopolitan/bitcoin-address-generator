import React from 'react';
import { TextField, FormMessage, TextArea, Button, TextIconSpacing, DoneSVGIcon } from 'react-md';
import ReeValidate from 'ree-validate'
import classnames from 'classnames'
import seed_validate from "../validators/rules/seed_validate";
import path_validate from "../validators/rules/path_validate";
import * as bip39 from 'bip39';

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

class Form extends React.Component{
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
            number: 1,
            errors: this.validator.errors,
        }

        this.onChange = this.onChange.bind(this)
        this.validateAndSubmit = this.validateAndSubmit.bind(this)
        this.generateRandomSeed = this.generateRandomSeed.bind(this)
    }

    onChange(e) {
        const name = e.target.name
        const value = e.target.value
        const { errors } = this.validator

        // reset errors for url field
        errors.remove(name)

        // update form data
        this.setState({ formData: { ...this.state.formData, [name]: value } })

        this.validator.validate(name, value)
            .then(() => {
                this.setState({ errors }, console.log(errors))
            })
            
    }

    submit(formData) {
        if(this.state.errors.items.length == 0)
            this.props.handleFormData(formData)
    }

    generateRandomSeed(){
        const _formData = {
            seed: bip39.generateMnemonic(256),
            path: "m/84'/0'/0'/0/0"
        }
        const _errors = this.validator.errors

        _errors.items = []
        this.setState({
            formData: _formData,
            errors: _errors
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
            this.setState({ errors })
        }
    }

    render() {
        const { errors } = this.state
        const disabled = errors.items.length != 0 || this.state.formData.path == '' || this.state.formData.seed == ''

        return (<form id="form-hd-segwit" className={'form'} onSubmit={this.validateAndSubmit}>
            <div className="row">
                <div className="col-xs-4">
                    {/*<button className="btn btn-block bg-pink waves-effect" type="submit">Generate</button>*/}
                    <Button id="outlined-button-1" theme="primary" themeType="contained" type="submit" disabled={disabled}>
                        {/*<TextIconSpacing icon={<DoneSVGIcon />}>*/}
                        {/*    Generate your Bitcoin Address!*/}
                        {/*</TextIconSpacing>*/}
                        {disabled ? '' : <DoneSVGIcon />}
                        Generate your <br className={'mobile-visible'} />Bitcoin Address!
                    </Button>
                </div>
            </div>
            <div className={"row"}>
                <div className="md-grid">
                    <TextArea
                        id="seed"
                        label="Seed Mnemonic"
                        type="seed"
                        lineDirection="center"
                        className="md-cell md-cell--bottom form-control"
                        rows={6}
                        value={this.state.formData.seed}
                        name="seed"
                        placeholder="Enter your seed"
                        required
                        error={errors.has('seed')}
                        onChange={this.onChange}
                    />
                    <FormMessage id={`seed-field-error-message`} error>
                    {
                        errors.has('seed') ?
                                "Invalid Seed Mnemonic!"
                            : ""
                    }
                    </FormMessage>

                </div>
            </div>
            <div className="row">
                <div className="md-grid">
                    <TextArea
                        id="path"
                        label="Path"
                        type="path"
                        lineDirection="center"
                        className="md-cell md-cell--bottom form-control"
                        rows={6}
                        name="path"
                        placeholder="m / purpose' / coin_type' / account' / change / address_index"
                        required
                        error={errors.has('path')}
                        value={this.state.formData.path}
                        onChange={this.onChange}
                    />
                    <FormMessage id={`seed-field-error-message`} error>
                    {
                        errors.has('path') ?
                                "Invalid Path!"
                            : ""
                    }
                    </FormMessage>

                </div>
            </div>
            <div className="row">
                <div className="col-xs-4">
                    <Button id="outlined-button-1" theme="primary" themeType="contained" onClick={() => this.generateRandomSeed()}>
                        Generate randomly
                    </Button>
                </div>
            </div>

        </form>)
    }
}

export default Form;