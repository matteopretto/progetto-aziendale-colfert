import Logo from '../components/logo';
import LoginForm from '../components/login-form';


function LoginPage({setIsLoggedIn}) {
    return (
        <div className="min-h-screen relative bg-gray-100 flex flex-col items-center justify-center space-y-7">
            <div className="flex items-center space-x-0 mb-4">
                <div>
   
                    <Logo />
                </div>
                 <div className="flex flex-col items-start -ml-40">
        <h1 className="text-3xl font-bold text-gray-700">OLFERT STATISTICS</h1>
        <div className="w-[100%] border-b-2 border-black mt-1"></div>
    </div>
               
            </div>
            <div className=" top-0 left-0 w-full h-1/3 rounded-b-3xl"></div>
            <LoginForm setIsLoggedIn={setIsLoggedIn}/>
        </div>
    );
}
export default LoginPage;