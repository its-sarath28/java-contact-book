import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL;

interface FormData {
  email: string;
  password: string;
}

interface ErrorMessage {
  message: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<ErrorMessage>({
    message: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { setIsLoggedIn, setUsername, setEmail } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(formData);

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/auth/sign-in`, formData);

      if (response.status === 200) {
        // console.log(response.data);
        const { token, fullName, email } = response.data;
        setIsLoggedIn(token);
        setUsername(fullName);
        setEmail(email);
        navigate("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err.response?.data;
        setError({
          message: axiosError?.message || "An error occurred",
        });
      } else {
        setError({
          message: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 bg-primary d-flex align-items-center justify-content-center">
        <div className="col col-md-6">
          <form onSubmit={handleSignIn} className="bg-white p-3 rounded">
            <div className="row">
              <div className="col-12 col-lg-6">
                <h3 className="mb-1">Welcome back!</h3>
                <p>Enter your credentials</p>

                {error && (
                  <p className="my-2 text-danger text-center">
                    {error.message}
                  </p>
                )}

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? <Loader size={25} color="#eee" /> : `Sign in`}
                  </button>
                </div>
              </div>
              <div className="col-12 col-lg-6 d-none d-lg-block">
                <figure className="w-100" style={{ height: "100%" }}>
                  <img
                    src="/assets/sign-in.jpg"
                    alt="sign-up"
                    className="img-fluid rounded-end object-fit-cover"
                    style={{ height: "100%" }}
                  />
                </figure>
              </div>
            </div>
          </form>
          <p className="text-white text-center">
            Don't have an account?{" "}
            <Link to={"/auth/sign-up"} className="text-white">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
