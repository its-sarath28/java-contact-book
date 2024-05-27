import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import AddContact from "../Pages/AddContact";
import EditContact from "../Pages/EditContact";
import Logout from "../Pages/Logout";
import ErrorPage from "../Pages/ErrorPage";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/contacts/add-contact" element={<AddContact />} />
        <Route
          path="/contacts/edit-contact/:contactId"
          element={<EditContact />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default Routers;
