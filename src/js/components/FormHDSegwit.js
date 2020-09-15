import React from 'react';
import {FormMessage, TextArea, Button, DoneSVGIcon, Select} from 'react-md';
import ReeValidate from 'ree-validate';
import seed_validate from "../validators/rules/seed_validate";
import path_validate from "../validators/rules/path_validate";
import * as bip39 from 'bip39';

const WORD_LIST = [12,15,18,21,24];

ReeValidate.Validator.extend('seed_validate', {
    validate: (value, { compare }) => {
        return seed_validate({value, compare, validationType: ''});
    },
    params: ['compare'],
    message: ''
});

ReeValidate.Validator.extend('path_validate', {
    validate: (value, { compare }) => {
        return path_validate({value, compare, validationType: ''});
    },
    params: ['compare'],
    message: ''
});

class FormHDSegwit extends React.Component{
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
            word: 24,
            errors: this.validator.errors,
        }

        this.generateRandomSeed = this.generateRandomSeed.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleUpdateWord = this.handleUpdateWord.bind(this)
        this.validateAndSubmit = this.validateAndSubmit.bind(this)
    }

    generateRandomSeed(){
        const _formData = {
            seed: bip39.generateMnemonic(this.state.word * 32 / 3),
            path: "m/84'/0'/0'/0/0"
        }
        const _errors = this.validator.errors

        _errors.items = []
        this.setState({
            formData: _formData,
            errors: _errors,
        })
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

    handleUpdateWord(_word){
        this.setState({ word: _word })
    }

    componentDidMount(){
        // Set Select field default text
        document.getElementById('custom-select-1-display-value').innerHTML = this.state.word
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

    submit(formData) {
        if(this.state.errors.items.length === 0)
            this.props.handleFormData(formData)
    }

    render() {
        const { errors } = this.state
        const disabled = errors.items.length !== 0 || this.state.formData.path === '' || this.state.formData.seed === ''

        return (<form id="form-hd-segwit" className={'form'} onSubmit={this.validateAndSubmit}>

            <div className="row">
                <div className="col-xs-4">
                    <Button id="outlined-button-1" theme="primary" themeType="contained" type="submit" disabled={disabled}>
                        {disabled ? '' : <DoneSVGIcon />}
                        Generate your <br className={'mobile-visible'} />Bitcoin Address!
                    </Button>
                </div>
            </div>
            <div className="row random">
                <div className="col-xs-4">
                    <Button id="outlined-button-1" theme="primary" themeType="outline" onClick={() => this.generateRandomSeed()}>
                        Generate Seed randomly
                    </Button>
                </div>
                <Select
                    id="custom-select-1"
                    name="word"
                    options={WORD_LIST}
                    label={`word`}
                    value={this.state.word}
                    type="word"
                    onChange={(word) => this.handleUpdateWord(word)}
                    required
                />
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
                        placeholder="Enter your Seed Mnemonic"
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
                        rows={3}
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


        </form>)
    }
}

export default FormHDSegwit;