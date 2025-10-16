import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldAlert, BadgeQuestionMark } from "lucide-react";
import '../libs/extensions';

function LoginForm() {
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
  const [showPassword, setShowPassword] = useState(false);

  const showPopUp = () => setShowPopup(!showPopup);
  const closePopUp = () => setShowPopup(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedUsername && savedPassword) {
      setActualUsername(savedUsername);
      setActualPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    fetch("/id-queries.json")
      .then((res) => res.json())
      .catch((err) => console.error("Errore caricamento JSON:", err));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isError) {
      const username = event.target.username.value;
      const password = event.target.password.value;
      setTentativi(tentativi + 1);

      try {
        const response = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: username, password }),
        });
        const data = await response.json();

        if (data.success) {
          const webstatsPermissions = [
            ...new Set(
              data.user.acl
                .filter((item) => item.category === "webstats")
                .map((item) => item.value1)
                .flat()
                .filter(Boolean)
            ),
          ];

          localStorage.setItem("permissions", JSON.stringify(webstatsPermissions));
          localStorage.setItem("user-role", data.user.role);
        
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("name", data.user.name);

          if (remember) {
            localStorage.setItem("savedUsername", username);
            localStorage.setItem("savedPassword", password);
          } else {
            localStorage.removeItem("savedUsername");
            localStorage.removeItem("savedPassword");
          }

          navigate("/dashboard");
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
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-1/3 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-wide">
        {intro}
      </h2>

      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="w-full mb-5">
          {!isError ? (
            <>
              <label
                htmlFor="username"
                className="block text-gray-700 mb-2 font-medium text-sm"
              >
                Username
              </label>
              <input
                className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(255,186,0)] transition-all text-sm"
                type="text"
                id="username"
                name="username"
                defaultValue={actulaUsername}
                required
              />
            </>
          ) : (
            <p className="text-red-500 font-semibold text-center text-sm">
              {errore}
            </p>
          )}
        </div>

        {/* Password */}
<div className="w-full mb-5 relative">
  {!isError ? (
    <>
      <label
        htmlFor="password"
        className="block text-gray-700 mb-2 font-medium text-sm"
      >
        Password
      </label>
      <input
        className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(255,186,0)] transition-all text-sm pr-10"
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        defaultValue={actualPassword}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-[-15%] text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </>
  ) : (
    <p className="text-red-500 font-semibold text-center text-sm">
      Se il problema persiste, contatta l'ufficio IT.
    </p>
  )}
</div>


        {/* Remember me */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {!isError ? (
            <>
              <input
                type="checkbox"
                id="reminder"
                name="reminder"
                className="w-4 h-4 accent-[rgb(255,186,0)]"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                htmlFor="reminder"
                className="text-gray-700 font-medium text-sm cursor-pointer"
              >
                Ricordami
              </label>
            </>
          ) : (
            <ShieldAlert className="text-red-500 w-[2.5em] h-[2.5em]" />
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-[rgb(255,186,0)] text-black font-semibold py-2.5 rounded-full shadow-sm hover:bg-[rgb(255,200,50)] hover:shadow-md transition-all duration-200 text-sm"
        >
          {btn}
        </button>

        {/* Help icon */}
        <div className="mt-5">
          <BadgeQuestionMark
            className="w-[1.8em] h-[1.8em] text-gray-500 hover:text-[rgb(255,186,0)] transition-colors duration-200 cursor-pointer"
            onClick={showPopUp}
          />
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[340px] text-center border border-gray-100 animate-scaleIn">
              <h3 className="text-lg font-bold mb-3 text-gray-800">HELP</h3>
              <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                Per accedere utilizza le tue credenziali aziendali. <br />
                In caso di problemi contatta l'ufficio IT.
              </p>
              <button
                className="bg-[rgb(255,186,0)] text-black px-5 py-1.5 rounded-full font-medium hover:bg-[rgb(255,200,50)] transition-all duration-200 text-sm"
                onClick={closePopUp}
              >
                CHIUDI
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Animazioni */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LoginForm;
