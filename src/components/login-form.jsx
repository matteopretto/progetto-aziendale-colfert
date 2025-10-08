import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainPage from "../pages/main-page";
import '../libs/extensions';
import { ShieldAlert, BadgeQuestionMark } from "lucide-react";




function LoginForm({ setIsLoggedIn }) {

    const navigate = useNavigate();
    const [intro, setIntro] = useState("INSERISCI LE TUE CREDENZIALI");
    const [errore, setErrore] = useState("");
    const [btn, setBtn] = useState("ACCEDI");
    const [isError, setIsError] = useState(false);
    const [tentativi, setTentativi] = useState(0);

    const [actulaUsername, setActualUsername] = useState("");
    const [actualPassword, setActualPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const [showPopup, setShowPopup] = useState(false);

    const showPopUp = () => setShowPopup(!showPopup);
    const closePopUp = () => setShowPopup(false);


    useEffect(() => {
        const savedUsername = localStorage.getItem('savedUsername');
        const savedPassword = localStorage.getItem('savedPassword');

        if (savedUsername && savedPassword) {
            setActualUsername(savedUsername);
            setActualPassword(savedPassword);
            setRemember(true);
        }
    }, []);

    useEffect(() => {
        fetch("/id-queries.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("JSON caricato:", data);
                const keys = Object.keys(data).slice(0, 4);
                keys.forEach((key) => {
                    console.log(`ID: ${key}`);
                    console.log(data[key].slice(0, 2600) + "...");
                });
            })
            .catch((err) => console.error("Errore caricamento JSON:", err));
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isError) {
            const username = event.target.username.value;
            const password = event.target.password.value;

            console.log("Tentativo di login con username:", username, password);
            setTentativi(tentativi + 1);

            try {
                const response = await fetch("http://localhost:3001/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ code: username, password })
                });

                const data = await response.json();
                console.log("Risposta dal server:", data);

                if (data.success) {
                    //Questo devo metterlo qua perchè devo salvarlo a prescindere del fatto in cui l'utente vuole essere ricordato o meno
                    const webstatsPermissions = [
                        ...new Set(
                            data.user.acl
                                .filter(item => item.category === "webstats")
                                .map(item => item.value1)
                                .flat()
                                .filter(Boolean)
                        )
                    ];

                    /* 
                    Questo mi serve per test
                    const perm = ["dir0001","per0001", "per0002"];
                     localStorage.setItem('permissions',  JSON.stringify(perm));
                     */
                    localStorage.setItem('permissions', JSON.stringify(webstatsPermissions));
                    localStorage.setItem('user-role', data.user.role);
                    localStorage.setItem('email', data.user.email);
                    console.log("role:", data.user.role);


                    if (remember) {
                        localStorage.setItem('savedUsername', username);
                        localStorage.setItem('savedPassword', password);



                    } else {
                        localStorage.removeItem('savedUsername');
                        localStorage.removeItem('savedPassword');


                    }

                    console.log("Permessi:", localStorage.getItem("permissions"));
                    setIsLoggedIn(true);
                    navigate('/dashboard');
                    setTentativi(0);
                    setActualUsername(username);
                    setActualPassword("");
                } else {
                    setIntro("ERRORE 401: CREDENZIALI ERRATE");
                    setBtn("RIPROVA");
                    setErrore("Le credenziali che hai inserito non sono valide.");
                    setIsError(true);
                }
            } catch (err) {
                setIntro("ERRORE 500: ERRORE DEL SERVER");
                setBtn("RIPROVA");
                setIsError(true);
                setErrore("Sembra che ci sia un errore con il server.");
                console.error(err);
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
                        <p className="text-red-500 font-bold">{errore}</p>
                    )}


                </div>
                <div className="mr-4 mb-3">
                    {!isError ? (
                        <><label className=" text-gray-700 mr-4" htmlFor="password"><span>Password</span></label><input className=" w-4/7 p-[1%] text-[1vw] border border-gray-300 rounded mb-[6%]" type="password" id="password" name="password" defaultValue={actualPassword} required /></>
                    ) : (
                        <p className="text-red-500 font-bold">Se il problema dovesse persistere contatta l'ufficio IT.</p>
                    )}

                </div>
                <div className="flex items-center mb-4">
                    {!isError ? (

                        <><input type="checkbox" id="reminder" name="reminder" className="mr-4" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><label className="text-gray-700 " for="reminder">Remember me</label></>

                    ) : (

                        <ShieldAlert className="text-red-500 w-[4em] h-[4em]" />


                    )}
                </div>

                <div className="mb-[6%]">
                    <button className="w-[20] bg-[rgb(255,186,0)] text-black p-2 rounded hover:bg-blue-600" type="submit">{btn}</button>
                </div>
                <div>

                    <BadgeQuestionMark className="w-[2em] h-[2em] text-gray-500 inline-block mr-2" onClick={showPopUp} />
                </div>
                {showPopup && (
                    <div className="absolute top-0 left-0 w-full flex items-center justify-center z-50 mt-5">
                        <div className="bg-gray-400 p-6 rounded shadow-lg w-1/2 relative text-center">
                            <h3 className="text-lg font-bold mb-2">HELP</h3>
                            <p>Per accedere utilizza le tue credenziali aziendali. Per ogni problema contatta l'ufficio IT.</p>
                            <button
                                className="mt-4 bg-[rgb(255,186,0)] text-black px-4 py-2 rounded hover:bg-blue-600"
                                onClick={closePopUp}
                            >
                                CHIUDI
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default LoginForm;