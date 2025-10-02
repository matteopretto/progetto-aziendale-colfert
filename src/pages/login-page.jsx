import Logo from '../components/logo';
import LoginForm from '../components/login-form';

function LoginPage({setIsLoggedIn}) {
    return (
        <div className="min-h-screen relative bg-gray-100 flex flex-col items-center justify-center space-y-7">
            <div className="flex items-center space-x-0 mb-4">
                <div>
                    <Logo />
                </div>
                <h1 id="titolo" className="-ml-40">COLFERT STATISTICS</h1>
            </div>
            <div className=" top-0 left-0 w-full h-1/3 rounded-b-3xl"></div>
            <LoginForm setIsLoggedIn={setIsLoggedIn}/>
        </div>
    );
}
export default LoginPage;