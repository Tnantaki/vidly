import Form from './common/Form'
import Joi from 'joi-browser'
import auth from "../services/authService";
import withRouter from './common/withRouter'

class LoginForm extends Form {
  state = {
    data: { username: "", password: "", },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
  }

  doSubmit = async () => {
    try {
      const { data } = this.state
      await auth.login(data.username, data.password)

      const { state } = this.props.router.location;
      window.location = state ? state.from.pathname : '/'
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors }
        errors.username = ex.response.data
        this.setState({errors})
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username')}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}
 
export default withRouter(LoginForm);