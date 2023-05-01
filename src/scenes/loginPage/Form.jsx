// loginPage is the functions and features involving the Login Page on the Front end. 


// Importing necessary libraries
import {useState} from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

// Defining the login form validation schema using yup
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});
// Initializing login form's input fields
const initialValuesLogin = {
  email: "",
  password: "",
};
// Function to get the email input
function getEmail(input){
  return input;
}
// Defining the login form component
const Form = () => {

  // State variables
  const [pageType, /*setPageType*/] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const { setEmail } = useContext(UserContext);
  const { email } = useContext(UserContext);

  // Login function to handle user authentication
  const login = async (values, onSubmitProps) => {
    const API_URL = 'http://frontend.digitaldreamforge.chat:5000/auth/login';
    // Send a POST request to the login endpoint with user's login information
    const loggedInResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    // Get the response from the server in JSON format
    const loggedIn = await loggedInResponse.json();
    // Reset the form after successful login
    onSubmitProps.resetForm();
    // If the user is authenticated, dispatch the login action with the user's data and token
    if (loggedIn) {
      dispatch(
        setLogin({
          employee: loggedIn.employee,
          token: loggedIn.token,
        })
      );
    }
    // Get the list of employees from the server
    const employeesResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/employees`);
    const employees = await employeesResponse.json();
    // Find the employee with the same email as the user's email
    const employee = employees.find(u => u.email === values.email);
    // Set the email context with the user's email
    setEmail(values.email);
    // Redirect the user based on their role after successful login
    if (employee && employee.role === "Admin") {
      navigate('/admin');
    } else if (employee && employee.role === "Management") {
      navigate('/manager');
    } else {
      navigate('/employee');
    }
  };
  // Function to handle form submission
  const handleFormSubmit = async (values, onSubmitProps) => {
    const employeeEmail = values.email;
    if (isLogin) await login(values, onSubmitProps);
  };
  // The Formik component that provides form handling utilities
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema= {loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "red",
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              value="Login"
            >
              LOGIN
            </Button>
            <Typography              
              sx={{
                p: "1rem",
                pb: "0 auto"
              }}>
              Please contact the administrator if you have trouble logging in.
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};
export const FormExport = { // export the Form component and email as an object
  Form,
  email: 'rebecca@ddfmail.com'
};
export default Form;