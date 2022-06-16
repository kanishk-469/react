import { useRef,useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
   const newPasswordInputRef = useRef();
   const history = useHistory();
   const authCtx = useContext(AuthContext);

  const  submitHandler = (event)=>{
  event.preventDefault();
       
  const newPassword = newPasswordInputRef.current.value;

  ///// optional validation of new password
    
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAybFlrirBWGeQkCYx4wnOGhrEVdkPVjh4',
    {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newPassword,
        returnSecureToken: false,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      /// assumption: always succeeds!!!
        

      /// i can stay on same page and show feedback to user
      history.replace('/');  /// but here we redirect to different page.

    });
    };


return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
