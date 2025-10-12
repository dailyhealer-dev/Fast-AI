import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/app/hooks";
import { Heading, Text } from "@chakra-ui/react";
import FormiKControl from "../../../forms/FormikControl";

const Login = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      await dispatch(login(values));
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (

  <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form>
          <Heading>Sign In</Heading>
          <Text>Sign in into your account</Text>
          <div className="form-control">
          <FormiKControl
            control="input"
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
          />
          <FormiKControl
            control="input"
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={formik.isSubmitting || loading}
            style={{marginTop: "5px"}}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {error && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {typeof error === "string" ? error : error.detail || "An error occurred"}
            </p>
          )}

          </div>
        </Form>
      )}
    </Formik>

   );
};

export default Login;