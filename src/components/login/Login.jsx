import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Login.css'
import { toast } from 'react-toastify';
import Loader from '../loader/Loader';
import { loginUserThunk } from '../../store/AuthSlice';
import packageJson from '../../../package.json';

const Login = ()=>{
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErr, setValidationErr] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const loginButtonRef = useRef(null);

    useEffect(()=>{
        const checkTokenAndNavigate = async () => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/');
            }
          };
          checkTokenAndNavigate();
    },[navigate])
    const {error, isLoading, isLoggedIn} = useSelector((state)=>state.auth);
    
    const loginClick = () =>{
        if (!email.trim() || !password.trim()) {
            toast.error('Please fill in all fields');
            setValidationErr('Invalid Email or Password');
          }
          else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast.error('Invalid email address');
            setValidationErr('Invalid Email');
          } 
          else if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setValidationErr('Invalid Password');
          }else{
            dispatch(loginUserThunk({email, password}))
        }
    }

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.keyCode === 13) {
                loginButtonRef.current.click();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    
    useEffect(()=>{
        if(isLoggedIn){
            navigate('/')
        }
    },[isLoggedIn]);

    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword)
    }

    return(
        <div className="loginMain">
            <div className="loginOuter">
                <div className="loginInner">
                    <div className='logo'>
                        <img src={logo} loading="lazy" width="100" height="100" style={{ objectFit: 'cover', borderRadius:'50%'}}/>
                        <span className='version' style={{position:'absolute',right:'0px'}}>v {packageJson.version}</span>
                    </div>
                    <dl>
                        <dt>Email <span className='req'>*</span></dt>
                        <dd>
                            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder='Enter Email'/>
                        </dd>
                        <dt>Password <span className='req'>*</span></dt>
                        <dd>
                            <input type={showPassword ? 'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter Password'/>
                            <span className="eyeIcon" style={{cursor:'pointer'}} onClick={togglePasswordVisibility}>
                                {showPassword ? <span className='bi bi-eye'></span> : <span className='bi bi-eye-slash'></span>}
                            </span>
                        </dd>
                        {
                            validationErr && <dd className='errDiv' style={{padding:'8px'}}>{validationErr}</dd>
                        }
                        <button style={{cursor:'pointer'}} ref={loginButtonRef} onClick={()=>loginClick()}>LOGIN</button>
                    </dl>
                    {
                        isLoading && <Loader/>
                    }
                    {
                        error && <div className='errDiv'><p>{error}</p></div>
                    }
                </div>
                <div className='loginImg'>
                    {/* <img src={theater} alt="" /> */}
                </div>
            </div>
        </div>
    )
}

export default Login;