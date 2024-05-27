import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../context/userContext";
import Loader from "../Components/Loader";

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL;

interface ContactData {
  full_name: string;
  email: string;
  contact_number: string;
}

const AddContact = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [contactData, setContactData] = useState<ContactData>({
    full_name: "",
    email: "",
    contact_number: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const token = isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);

  const handleAddContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(contactData);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/contacts/create-contact`,
        contactData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // console.log(response.data);
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error while adding contact: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 bg-primary d-flex align-items-center justify-content-center">
        <div className="col col-md-6">
          <form onSubmit={handleAddContact} className="bg-white p-3 rounded">
            <div className="row">
              <div className="col-12">
                <Link to={"/"} className="btn btn-primary">
                  Back
                </Link>

                <h3 className="my-3 text-center">Add Contact</h3>

                <div className="mb-3">
                  <input
                    type="text"
                    name="full_name"
                    className="form-control"
                    placeholder="Full name"
                    value={contactData.full_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={contactData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="tel"
                    name="contact_number"
                    className="form-control"
                    placeholder="Contact number"
                    value={contactData.contact_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? (
                      <Loader size={25} color="#eee" />
                    ) : (
                      `Add contact`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
