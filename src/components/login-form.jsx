import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MainPage from "../pages/main-page";

function LoginForm({ setIsLoggedIn }) {

    const navigate = useNavigate();
    const [intro, setIntro] = useState("INSERISCI LE TUE CREDENZIALI");
    const [btn, setBtn] = useState("ACCEDI");
    const [isError, setIsError] = useState(false);
    const [tentativi, setTentativi] = useState(0);

    const [actulaUsername, setActualUsername] = useState("");
    const [ actualPassword, setActualPassword ] = useState("");



    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isError) {
            setTentativi(tentativi + 1);
            const username = event.target.username.value;
            const password = event.target.password.value;

            const successfulLogin = (username === 'a' && password === 'a');

            if (!successfulLogin) {
                setIntro("ERRORE 401: CREDENZIALI ERRATE");
                setBtn("RIPROVA");
                setIsError(true);
            }
            else {

                setIsLoggedIn(true);
                navigate('/dashboard');
                setTentativi(0);
                setActualUsername(username);
                setActualPassword(password);
            }
        } else {
            setIntro("INSERISCI LE TUE CREDENZIALI");
            setBtn("ACCEDI");
            setIsError(false);
        }
    }

    return (

        <div className="bg-white p-12 rounded shadow-md w-3/7 min-h-[50vh]">

            <h2 className="text-2xl font-bold mb-6 text-center">{intro}</h2>

            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <div className="mr-4">
                    {!isError ? (
                        <><label className="text-gray-700 mr-4" htmlFor="username"><span>Username</span></label><input className="w-4/7 p-[1%] text-[1vw] border border-gray-300 rounded mb-[6%]" type="text" id="username" name="username" defaultValue={actulaUsername} required /></>
                    ) : (
                        <p className="text-red-500 font-bold">Hai inserito username e/o password errata. Ti invitiamo a riprovare.</p>
                    )}


                </div>
                <div className="mr-4">
                    {!isError ? (
                        <><label className=" text-gray-700 mr-4" htmlFor="password"><span>Password</span></label><input className=" w-4/7 p-[1%] text-[1vw] border border-gray-300 rounded mb-[6%]" type="password" id="password" name="password" defaultValue={actualPassword} required /></>
                    ) : (
                        <p className="text-red-500 font-bold">Se il problema dovesse persistere contatta l'assistenza.</p>
                    )}

                </div>
                <div className="flex items-center mb-4">
                    {!isError ? (

                        <><input type="checkbox" id="reminder" name="reminder" className="mr-4" /><label className="text-gray-700 " for="reminder">Remember me</label></>

                    ) : (
                        <p className="font-bold">Hai gia effettuato:{tentativi} tentativi.</p>
                    )}
                </div>

                <div className="mb-[6%]">
                    <button className="w-[20] bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">{btn}</button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;