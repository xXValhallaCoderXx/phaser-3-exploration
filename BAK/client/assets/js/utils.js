function signIn() {
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value,
  };

  postData("/login", body)
    .then((res) => {
      if (res.status !== 200) throw Error(res.error);
      window.location.replace("/game.html");
    })
    .catch((err) => {
      console.log("err", err);
      window.location.replace("/index.html");
    });
}

function signUp() {
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value,
    username: document.forms[0].elements[2].value,
  };

  postData("/signup", body)
    .then((res) => {
      if (res.status !== 200) throw Error(res.error);
      window.location.replace("/index.html");
    })
    .catch((err) => {
      console.log("err", err.message);
      window.location.replace("/sign-up.html");
    });
}

function forgotPassword() {
  const body = {
    email: document.forms[0].elements[0].value,
  };

  postData("/forgot-password", body)
    .then((res) => {
      if (res.status !== 200) throw Error(res.error);
      window.alert("Password reset email sent");
      window.location.replace("/index.html");
    })
    .catch((err) => {
      window.alert("err", err.message);
      window.location.replace("/forgot-password.html");
    });
}

function resetPassword() {
  const password = document.forms[0].elements[1].value;
  const verifyPassword = document.forms[0].elements[2].value;
  const body = {
    email: document.forms[0].elements[0].value,
    password,
    verifyPassword,
    token: document.location.href.split("token=")[1],
  };
  if (password !== verifyPassword) {
    window.alert("Password don't mathc");
  }
  console.log("BODY: ", body);
  postData("/reset-password", body)
    .then((res) => {
      if (res.status !== 200) throw Error(res.error);
      window.alert("Password updated");
      window.location.replace("/index.html");
    })
    .catch((err) => {
      window.alert("err", err.message);
      window.location.replace("/reset-password.html");
    });
}

function postData(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrer: "no-referer",
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
