import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";
import DeleteModal from "../Components/DeleteModal";

interface Contact {
  id: string;
  full_name: string;
  contact_number: string;
  email: string;
}

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL;

const Home: React.FC = () => {
  const [contactData, setContactData] = useState<Contact[]>([]);
  const { isLoggedIn, username, email } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const token: string | null = isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }

    const getContacts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Contact[]>(
          `${BASE_URL}/contacts/list-contacts`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setContactData(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log(`Error in getting contacts: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    getContacts();
  }, [token, navigate]);

  const avatar: string | undefined = username?.substring(0, 2).toUpperCase();

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/contacts/delete-contact/${contactToDelete}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContactData(
        contactData.filter((contact) => contact.id !== contactToDelete)
      );
      toggleOpen();
    } catch (err) {
      console.log(`Error in deleting contact: ${err}`);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 bg-primary d-flex align-items-center justify-content-center">
        <div className="col col-md-7">
          {isLoading && (
            <div className="d-flex align-items-center gap-4 justify-content-center">
              <Loader size={35} color="#eee" />
              <p className="mb-0 text-light">
                Please wait while getting your contacts
              </p>
            </div>
          )}

          {!isLoading && (
            <main className="col-12 bg-white border p-2">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-6 d-flex align-items-center gap-4">
                  <div className="bg-primary p-3 text-white rounded">
                    {avatar}
                  </div>
                  <div>
                    <p className="mb-0">{username}</p>
                    <span>{email}</span>
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Button group with nested dropdown"
                  >
                    <button type="button" className="btn btn-info">
                      Settings
                    </button>
                    <div className="btn-group" role="group">
                      <button
                        id="btnGroupDrop3"
                        type="button"
                        className="btn btn-info dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      ></button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="btnGroupDrop3"
                      >
                        <Link
                          className="dropdown-item"
                          to={"/contacts/add-contact"}
                        >
                          Add Contact
                        </Link>
                        <Link className="dropdown-item" to={"/auth/logout"}>
                          Logout
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="w-75 mx-auto my-4" />

              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Contact number</th>
                      <th scope="col">Email</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactData.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          You dont have any Contacts yet!
                        </td>
                      </tr>
                    )}

                    {contactData.length > 0 &&
                      contactData.map((contact: Contact) => (
                        <tr key={contact.id} className="align-middle">
                          <td>{contact.full_name}</td>
                          <td>{contact.contact_number}</td>
                          <td>{contact.email}</td>
                          <td>
                            <div className="d-flex gap-3">
                              <Link
                                to={`/contacts/edit-contact/${contact.id}`}
                                className="btn btn-primary"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  setContactToDelete(contact.id);
                                  toggleOpen();
                                }}
                                className="btn btn-danger"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <DeleteModal isOpen={isOpen} toggleOpen={toggleOpen}>
                <div className="d-flex flex-column">
                  <p>Are you sure that you want to delete this contact?</p>
                  <div className="mt-5 d-flex justify-content-center gap-4">
                    <button
                      onClick={toggleOpen}
                      className="btn btn-secondary px-3 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteContact}
                      className="btn btn-danger px-3 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </DeleteModal>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
