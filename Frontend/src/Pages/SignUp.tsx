import axios from "axios";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../Components/Loader";
import { UserContext } from "../context/userContext";

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL;

interface FormData {
  full_name: string;
  email: string;
  password: string;
}

interface ErrorMessage {
  message: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
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

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(formData);

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/auth/sign-up`, formData);

      if (response.status === 200) {
        console.log(response.data);
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
          <form onSubmit={handleSignUp} className="bg-white p-3 rounded">
            <div className="row">
              <div className="col-12 col-lg-6 d-none d-lg-block">
                <figure className="w-100" style={{ height: "100%" }}>
                  <img
                    src="/assets/sign-up.jpg"
                    alt="sign-up"
                    className="img-fluid rounded-start object-fit-cover"
                    style={{ height: "100%" }}
                  />
                </figure>
              </div>
              <div className="col-12 col-lg-6">
                <h3 className="mb-1">Create an account</h3>
                <p>Fill up your details</p>

                {error && (
                  <p className="my-2 text-danger text-center">
                    {error.message}
                  </p>
                )}

                <div className="mb-3">
                  <input
                    type="text"
                    name="full_name"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>

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
                    {isLoading ? <Loader size={25} color="#eee" /> : `Sign up`}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <p className="text-white text-center">
            Already have an account?{" "}
            <Link to={"/auth/sign-in"} className="text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
