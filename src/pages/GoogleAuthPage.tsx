import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthPage() {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google credential:", credentialResponse);
    navigate("/"); // 인증 성공 후 홈 페이지로 이동
  };

  const handleGoogleFailure = () => {
    console.error("Google 로그인 실패");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ""}>
      <div>
        <h2>Google OAuth 인증</h2>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          useOneTap={true}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
