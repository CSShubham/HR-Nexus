import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, EyeOff, Eye } from "lucide-react";
import { loginHR, loginEmployee } from "../../features/auth/authThunks";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [isHR, setIsHR] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    employeeId: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isHR) {
        await dispatch(
          loginHR({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();
        navigate("/hr/dashboard");
      } else {
        await dispatch(
          loginEmployee({
            employeeId: formData.employeeId,
            password: formData.password,
          }),
        ).unwrap();
        navigate("/employee/dashboard");
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsHR(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            isHR
              ? "bg-primary-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          HR Login
        </button>
        <button
          onClick={() => setIsHR(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            !isHR
              ? "bg-primary-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Employee Login
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
            {error}
          </div>
        )}
        {isHR ? (
          <>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              placeholder="hr@company.com"
              required
            />
            <Input
              label="Password"
              type={showpassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              rightIcon={showpassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showpassword)}
              placeholder="••••••••"
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Employee ID"
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              icon={User}
              placeholder="EMP0001"
              required
            />
            <Input
              label="Password"
              type={showpassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              rightIcon={showpassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showpassword)}
              placeholder="••••••••"
              required
            />
          </>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
          Forgot password?
        </a>
      </div>
    </>
  );
};

export default LoginForm;
