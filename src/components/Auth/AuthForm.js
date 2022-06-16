import { useState, useRef, useContext} from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading]= useState(false);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const emailEntered = emailInputRef.current.value;
    const passwordEntered = passwordInputRef.current.value;

    //// optional : Add Validation code
      setIsLoading(true);

      let url;
    if (isLogin) {
      /// send request to different URL take from firebase documention sigin authetication section
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAybFlrirBWGeQkCYx4wnOGhrEVdkPVjh4";

    } else {
      /// signup URL 
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAybFlrirBWGeQkCYx4wnOGhrEVdkPVjh4";
    }
      fetch(url,
        {
          method: "POST",
          body: JSON.stringify({
            email: emailEntered,
            password: passwordEntered,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
    
      ).then((res) => {
        setIsLoading(false);
        if (res.ok) {
          //....
          return res.json();
        } else {
          return res.json().then((data) => {
            ///...show an error modal
            ///console.log(data);
            let errorMessage = 'Authentication failed';
            if(data && data.error && data.error.message){
               errorMessage = data.error.message;
            }
            // alert(errorMessage);
            
            throw new Error(errorMessage);
          });
        }
      }).then( (data) =>{

        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        /// want login function to set my idToken, useContext
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');   //// so that we wouldn't go back by pressing back button
        console.log(data);   /// endup with successful request i.e., signin or sigup succeded
      }).catch( err => {
        alert(err.message); 
      });
      /// Now store the idToken returned by firebase auth server after successful login 
      //of running react application, can use CONTEXT API or REDUX ( for app-wide state).
      /// here idToken should be of app-wide state.
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
            >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
