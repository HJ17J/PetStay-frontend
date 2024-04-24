import "../styles/Register.scss";

export default function Register() {
  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/kakaotalk_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/naver_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/google_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/apple_logo.png"
                  alt=""
                />
              </a>
            </div>
          </form>
          <form action="#" className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/kakaotalk_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/naver_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/google_logo.png"
                  alt=""
                />
              </a>
              <a href="#" className="social-icon">
                <img
                  className="social"
                  src="/register/images/apple_logo.png"
                  alt=""
                />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => {
                const container = document.querySelector(".container");
                container?.classList.add("sign-up-mode");
              }}
            >
              Sign up
            </button>
          </div>
          <img src="/register/images/login.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => {
                const container = document.querySelector(".container");
                container?.classList.remove("sign-up-mode");
              }}
            >
              Sign in
            </button>
          </div>
          <img src="/register/images/reg.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
}
