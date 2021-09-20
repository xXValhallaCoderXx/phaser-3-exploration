// function signIn() {
//   const body = {
//     email: document.forms[0].elements[0].value,
//     password: document.forms[0].elements[1].value,
//   };

//   postData("/login", body)
//     .then((res) => {
//       if (res.status !== 200) throw Error(res.error);
//       window.location.replace("/game.html");
//     })
//     .catch((err) => {
//       console.log("err", err);
//       window.location.replace("/index.html");
//     });
// }
import axios from "axios";

const LoginContainer = () => {
  const onClickLogin = async () => {
    const res = axios.post("http://localhost:4000/login", {
      hello: "stin",
    });
    console.log("RS: ", res);
  };
  return <div onClick={onClickLogin}>sssss</div>;
};

export default LoginContainer;
