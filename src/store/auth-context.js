import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';



///global variable 
let logoutTimer;

///// initial data, general shape or structure, to get better auto-complition later
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) =>{},
    logout: () =>{}

});

/// add helper function for calculate remaining time
const calculateRemainingTime =(expirationTime) =>{
    // return remaing duration in miliseconds so we can use in setTimeOut() function as it is
    const currentTime = new Date().getTime();
    // i want expiratinTime in string 
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime; // negative value, we can handle it after
     return remainingDuration;
};

const retrieveStoredToken = () =>{
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 3600){                    //// 60000 means 1 min.
       localStorage.removeItem('token');
       localStorage.removeItem('expirationTime');
       return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    };
}

/// AuthContextProvider component responsible for managing auth related state
// it receives props because it provide <AuthContext.Provider> wrapped around props children
export const AuthContextProvider = (props) =>{
    const tokenData = retrieveStoredToken();
    let initialToken;
    if(tokenData){
        initialToken = tokenData.token ; 
    }
    
    // const initialToken = localStorage.getItem('token');  /// first time it's undefined
    const [token, setToken ]=useState(initialToken);
    ///// no token no loggedIn, have token that means User is LoggedIn
    const userIsLoggedIn = !!token;  // convert truthy to true boolean value vice-versa, default javascript trick
   
      const logoutHandler = useCallback(()=>{      /// to avoid un-neceesary re execution of logoutHandler
          setToken(null);
          localStorage.removeItem('token');     /// browser builtin function 
          localStorage.removeItem('expirationTime');     /// browser builtin function 

          if(logoutTimer){
              clearTimeout(logoutTimer);    /// browser builtin function 
          }
      },[]);  /// no need to add dependencies

   /// functions for changing the token state
          const loginHandler=(token, expirationTime)=>{
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationTime', expirationTime);
            const remainingTime = calculateRemainingTime(expirationTime);

            logoutTimer =  setTimeout(logoutHandler, remainingTime);
        };

     useEffect(()=>{
       if(tokenData){
           console.log(tokenData.duration);
        logoutTimer =  setTimeout(logoutHandler, tokenData.duration);
       }
       },[tokenData,logoutHandler]);
      const contextValue = {
          token: token,
          isLoggedIn: userIsLoggedIn,
          login: loginHandler,
          logout: logoutHandler,
      }

   return <AuthContext.Provider value ={contextValue }>
       {props.children}
   </AuthContext.Provider>
};

export default AuthContext;



// import React, { useState, useEffect, useCallback } from 'react';

// let logoutTimer;

// const AuthContext = React.createContext({
//   token: '',
//   isLoggedIn: false,
//   login: (token) => {},
//   logout: () => {},
// });

// const calculateRemainingTime = (expirationTime) => {
//   const currentTime = new Date().getTime();
//   const adjExpirationTime = new Date(expirationTime).getTime();

//   const remainingDuration = adjExpirationTime - currentTime;

//   return remainingDuration;
// };

// const retrieveStoredToken = () => {
//   const storedToken = localStorage.getItem('token');
//   const storedExpirationDate = localStorage.getItem('expirationTime');

//   const remainingTime = calculateRemainingTime(storedExpirationDate);

//   if (remainingTime <= 3600) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('expirationTime');
//     return null;
//   }

//   return {
//     token: storedToken,
//     duration: remainingTime,
//   };
// };

// export const AuthContextProvider = (props) => {
//   const tokenData = retrieveStoredToken();
  
//   let initialToken;
//   if (tokenData) {
//     initialToken = tokenData.token;
//   }

//   const [token, setToken] = useState(initialToken);

//   const userIsLoggedIn = !!token;

//   const logoutHandler = useCallback(() => {
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('expirationTime');

//     if (logoutTimer) {
//       clearTimeout(logoutTimer);
//     }
//   }, []);

//   const loginHandler = (token, expirationTime) => {
//     setToken(token);
//     localStorage.setItem('token', token);
//     localStorage.setItem('expirationTime', expirationTime);

//     const remainingTime = calculateRemainingTime(expirationTime);

//     logoutTimer = setTimeout(logoutHandler, remainingTime);
//   };

//   useEffect(() => {
//     if (tokenData) {
//       console.log(tokenData.duration);
//       logoutTimer = setTimeout(logoutHandler, tokenData.duration);
//     }
//   }, [tokenData, logoutHandler]);

//   const contextValue = {
//     token: token,
//     isLoggedIn: userIsLoggedIn,
//     login: loginHandler,
//     logout: logoutHandler,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;