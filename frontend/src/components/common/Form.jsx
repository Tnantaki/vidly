import { Component } from 'react'
import Select from './Select';
import Input from './Input';
import Joi from 'joi-browser'

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false, allowUnknown: true };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  validateProperty = ({ name, value }) => {
    const inputObj = { [name]: value };
    const schemaObj = { [name]: this.schema[name] };
    const { error } = Joi.validate(inputObj, schemaObj);
    return error ? error.details[0].message : null;
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data, errors });
  };

  handleSelect = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);
    if (errorMessage) errors[e.target.name] = errorMessage;
    else delete errors[e.target.name];

    const data = { ...this.state.data };
    data[e.target.name] = e.target.value;
    this.setState({ data, errors });
  }

  renderButton = (label) => (
    <button disabled={this.validate()} className="btn btn-primary">
      {label}
    </button>
  );

  renderInput = (name, label, type='text') => {
    const {data, errors} = this.state
    return (
      <Input
        name={name}
        type={type}
        value={data[name]}
        label={label}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  };

  renderSelect = (name, label, options) => {
    const {data, errors} = this.state
    return (
      <Select
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        options={options}
        onChange={this.handleSelect}
      />
    );

  }
}
 
export default Form;