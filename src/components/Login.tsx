import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const Start = () => {
    navigate("Timeline");
  };

  return (
    <div>
      <p>Login</p>
      <Button onClick={Start}>始める</Button>
    </div>
  );
}
