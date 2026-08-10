import { Input, Button, Form, Select } from "antd";
import signupPagePic from "../assets/signupPagePic.png";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import User from "../Context/Context";
import LoaderContext from "../Context/LoaderContext";

import { toast, ToastContainer } from "react-toastify";

import api from "../api/api";

import PageTitle from "../Components/PageTitle";
import Loader from "../Components/Loader";

export default function Signup() {
  const { user, setUser } = useContext(User);
  const { setLoader } = useContext(LoaderContext);

  const [roles, setRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(true);

  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Get User Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRoleLoading(true);

        const response = await api.get("/api/User/UserRole");

        console.log("Roles:", response.data);

        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);

        toast.error("Unable to load user roles!");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Signup
  const onFinish = async (values) => {
    setLoader(true);

    try {
      const response = await api.post("/api/User/CreateUser", {
        firstname: values.firstname,
        lastname: values.lastname,
        phone: values.phonenumber,
        email: values.email,
        password: values.password,
        roleId: values.roleId,
      });

      console.log("Signup Response:", response.data);

      toast.success("Sign up successfully", {
        onClose: () => {
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }

          setUser(response.data);

          navigate("/account-verification");
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong, please try again!";

      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  // Form validation failed
  const onFinishFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);

    toast.error("Please enter all required fields!");
  };

  return (
    <div className="flex justify-between min-h-screen">
      <ToastContainer autoClose={1000} />

      <Loader />

      <PageTitle title="Signup" />

      {/* Left Image Section */}

      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src={signupPagePic}
          alt="Signup"
          className="w-full hidden md:block max-h-[400px] object-cover"
        />
      </div>

      {/* Right Signup Section */}

      <div className="w-full md:w-1/2 bg-primary-blue flex justify-center items-center">
        <div className="w-[80%]">
          <h1 className="text-4xl text-white font-bold text-center mb-7">
            Signup
          </h1>

          <h3 className="mb-4 text-white">
            <span className="font-bold">Note:</span> Ensure the email is correct
            and active, as it will be used for account verification.
          </h3>

          <Form
            name="signup"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* User Role */}

            <Form.Item
              name="roleId"
              rules={[
                {
                  required: true,
                  message: "Please select your user role!",
                },
              ]}
            >
              <Select
                placeholder="Select User Role"
                size="large"
                loading={roleLoading}
                disabled={roleLoading}
                className="w-full"
                options={roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
              />
            </Form.Item>

            {/* First Name */}

            <Form.Item
              name="firstname"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
            >
              <Input type="text" placeholder="Firstname" className="w-full" />
            </Form.Item>

            {/* Last Name */}

            <Form.Item
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
            >
              <Input type="text" placeholder="Lastname" className="w-full" />
            </Form.Item>

            {/* Phone Number */}

            <Form.Item
              name="phonenumber"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Phone Number"
                className="w-full"
              />
            </Form.Item>

            {/* Email */}

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter Email"
                className="w-full"
              />
            </Form.Item>

            {/* Password */}

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password placeholder="Enter Password" className="w-full" />
            </Form.Item>

            {/* Confirm Password */}

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },

                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("The two passwords do not match!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Enter Confirm Password"
                className="w-full"
              />
            </Form.Item>

            {/* Login Link */}

            <div className="mb-4">
              <p className="text-[#ffffff9d]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer text-white hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Signup Button */}

            <div className="mb-8 flex justify-center mt-6">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow"
                >
                  <div className="absolute inset-0 w-0 bg-[#b3caff] transition-all duration-[250ms] ease-out group-hover:w-full"></div>

                  <span className="relative text-primary-blue group-hover:text-blue-800 font-bold">
                    Sign up
                  </span>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
