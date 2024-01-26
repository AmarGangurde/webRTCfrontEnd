import HomePage from './pages/HomePage/HomePage';
import SignUpGoogle from './component/SignUpGoogle';
import UserHomePage from './pages/UserHomePage/UserHomePage';
import SubscriptionPage from './pages/SubscriptionPage/SubScriptionPage';
import AfterSubscription from './pages/AfterSubscription/AfterSubscription';
import GooglePayPage from './pages/SubscriptionPage/GooglePayPage';
import NewSignUp from './pages/NewSignUp/NewSignUp';
import NewSignIn from './pages/NewSignInPage/NewSignIn';
import { Route,Routes } from 'react-router-dom';
import Darkmode from './component/Darkmode'
import { CssBaseline } from '@mui/material';
import CheckUser from '../src/component/SignIn'
import React, { useEffect, useState } from 'react';





function App(){

        const USER_TYPES = {
          beforSign: 'public',
          afterSign: 'admin',
        };
      
        const [current_user, setCurrentUser] = useState(USER_TYPES.beforSign);
      
        useEffect(() => {
          // Fetch user information from your Django backend
          const fetchUser = async () => {
            try {
              const response = await fetch('http://192.168.1.28:8000/api/auth', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  // Add any authentication headers if needed
                },
                // Add credentials: 'include' if you are using cookies for authentication
              });
      
              if (response.ok) {
                const user = await response.json();
                // Determine user type and set current_user accordingly
                setCurrentUser(user.is_authenticated ? USER_TYPES.afterSign : USER_TYPES.beforSign);
              } else {
                console.error('Failed to fetch user information');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };
      
          // Call the fetchUser function when the component mounts
          fetchUser();
        }, [])
   
    return(
            <Routes>
                <Route path='/' element={<PublicElement><HomePage/></PublicElement>}/>
                <Route path='/NewSignIn' element={<NewSignIn/>}/>
                <Route path='/NewSignUp' element={<NewSignUp/>}/>
                <Route path='/SignUpGoogle' element={<SignUpGoogle/>}/>
                <Route path='/UserHomePage' element={<UserElement><UserHomePage/></UserElement>}/>
                <Route path='/SubscriptionPage' element={<UserElement><SubscriptionPage/></UserElement>}/>
                <Route path='/AfterSubscription' element={<UserElement><AfterSubscription/></UserElement>}/>
                <Route path='/GooglePayPage' element={<UserElement><GooglePayPage/></UserElement>}/>
                <Route path='*' element={<div>Page not found</div>}/>
            </Routes>      
    )

    function PublicElement ({children}){
        return <>
            {children}
        </>
    }

    function UserElement ({children}){

        if(current_user === USER_TYPES.afterSign)
        return <>
            {children}
        </>
        else{
            window.alert("You dont have access to this page")
        }
    }


    
}
export default App;