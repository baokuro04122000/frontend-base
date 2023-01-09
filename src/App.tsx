import { useEffect, useState } from "react";
import Routes from "./routes";
import { useAppDispatch } from "./store";
import { actionAutoLogin } from "./store/authentication/action";

function App() {
  const [checkPersistantLogin, setCheckPersistantLogin] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!checkPersistantLogin) {
      dispatch(actionAutoLogin());
      setCheckPersistantLogin(true);
    }
  }, [checkPersistantLogin, dispatch]);

  return checkPersistantLogin ? <Routes /> : null;
}

export default App;
