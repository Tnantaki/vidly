import { register } from '../services/userService';
import Form from './common/Form'
import Joi from 'joi-browser'
import withRouter from './common/withRouter';
import auth from '../services/authService'

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
  };

  doSubmit = async () => {
    try {
      const res = await register(this.state.data)
      auth.loginWithJWT(res.headers['x-auth-token'])
      window.location = '/'
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = {...this.state.errors}
        errors.username = ex.response.data
        this.setState({ errors });
      }  
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default withRouter(RegisterForm);

try {
  const res = await register(this.state.data)
  localStorage.setItem('token', res.headers['x-auth-token'])
  this.props.router.navigate('/')
} catch (ex) {
  if (ex.response && ex.response.status === 400) {
    const errors = {...this.state.errors}
    errors.username = ex.response.data
    this.setState({ errors });
  }  
}