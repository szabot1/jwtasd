import React, { useEffect, useState } from "react";

export default function App() {
  const [jwt, setJwt] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [stock, setStock] = useState(undefined);

  function handleLogin(event) {
    event.preventDefault();
    event.persist();

    setError(undefined);

    fetch("https://jwt.sulla.hu/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          return;
        } else if (res.token) {
          setJwt(res.token);
        } else {
          setError("Ismeretlen hiba");
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    if (!jwt) {
      setStock(undefined);
      return;
    }

    fetch("https://jwt.sulla.hu/termekek", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setStock(res);
      })
      .catch((err) => {
        setError(err);
      });
  }, [jwt]);

  return (
    <main className="w-full h-full min-h-dvh flex items-center justify-center">
      <section className="w-full mx-4 lg:w-4/12 lg:mx-0 border border-slate-300 rounded-md shadow-md px-3 py-1.5">
        {jwt ? (
          <div className="flex flex-col justify-center gap-4">
            <div className="font-semibold text-xl flex flex-row gap-2 items-center justify-center">
              <span>Termékek</span>

              <button
                onClick={() => setJwt(undefined)}
                className="text-base border border-red-500 bg-red-500 text-white font-semibold rounded-md p-1.5 hover:bg-red-600 transition-colors duration-300 ease-in-out"
              >
                Kijelentkezés
              </button>
            </div>

            {error && (
              <div className="bg-red-200 text-red-800 p-2 rounded-md">
                {error}
              </div>
            )}

            {stock ? (
              <ul className="flex flex-col gap-2">
                {stock.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <span>{item.price} Ft</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center">Betöltés...</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-4">
            <h1 className="font-semibold text-xl text-center">Bejelentkezés</h1>

            {error && (
              <div className="bg-red-200 text-red-800 p-2 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-semibold">
                  Felhasználónév
                </label>
                <input
                  id="username"
                  type="text"
                  className="border border-slate-300 rounded-md p-1.5 transition-colors duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  Jelszó
                </label>
                <input
                  id="password"
                  type="password"
                  className="border border-slate-300 rounded-md p-1.5 transition-colors duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold rounded-md p-1.5 hover:bg-blue-600 transition-colors duration-300 ease-in-out"
              >
                Bejelentkezés
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
