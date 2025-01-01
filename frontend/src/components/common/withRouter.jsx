import { useNavigate, useLocation, useParams } from "react-router-dom";

// In React Router v6, Can't access props like match, location, and history
// We use hooks to access. But hooks only use in function component
// So, We wrap component using a custom wrapper function.
function withRouter(Component) {
  function ComponentWithRouterProps(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }
  return ComponentWithRouterProps;
}
 
export default withRouter