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


const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

function getEmail(input){
  return input;
}

const Form = () => {
  const [pageType, /*setPageType*/] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const { setEmail } = useContext(UserContext);
  const { email } = useContext(UserContext);

  //"Access-Control-Allow-Origin": "http://frontend.digitaldreamforge.chat:5000/auth/login"
  const login = async (values, onSubmitProps) => {
    const API_URL = 'http://frontend.digitaldreamforge.chat:5000/auth/login';
    const loggedInResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
    } 
    const usersResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/users`);
    const users = await usersResponse.json();
    const user = users.find(u => u.email === values.email);
    setEmail(values.email);
    console.log("User data:", user);
    console.log("Role:", user && user.role);
    if (user && user.role === "Admin") {
      navigate('/admin');
    } else if (user && user.role === "Management") {
      navigate('/manager');
    } else {
      navigate('/employee');
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const userEmail = values.email;
    if (isLogin) await login(values, onSubmitProps);
  };

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