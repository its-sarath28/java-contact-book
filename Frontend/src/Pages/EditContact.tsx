import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";
import toast from "react-hot-toast";

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL;

interface Contact {
  id: string;
  full_name: string;
  contact_number: string;
  email: string;
}

const EditContact: React.FC = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { contactId } = useParams<{ contactId: string }>();
  const [contactData, setContactData] = useState<Contact>({
    id: "",
    full_name: "",
    email: "",
    contact_number: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const token = isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }

    const getContactData = async () => {
      try {
        setIsPageLoading(true);
        const response = await axios.get<Contact>(
          `${BASE_URL}/contacts/${contactId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setContactData(response.data);
        }
      } catch (err) {
        console.log(`Error in getting contact data: ${err}`);
      } finally {
        setIsPageLoading(false);
      }
    };

    getContactData();
  }, [isLoggedIn, navigate, contactId]);

  const handleEditContact = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(contactData);
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.put(
        `${BASE_URL}/contacts/update-contact/${contactId}`,
        contactData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(`Error while updating contact: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 bg-primary d-flex align-items-center justify-content-center">
        <div className="col col-md-6">
          {isPageLoading && (
            <div className="d-flex align-items-center gap-4 justify-content-center">
              <Loader size={35} color="#eee" />
              <p className="mb-0 text-light">
                Plase wait while getting your contact data
              </p>
            </div>
          )}

          {!isPageLoading && (
            <form onSubmit={handleEditContact} className="bg-white p-3 rounded">
              <div className="row">
                <div className="col-12">
                  <Link to={"/"} className="btn btn-primary">
                    Back
                  </Link>

                  <h3 className="my-3 text-center">Update Contact</h3>

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
                        `Update contact`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditContact;
