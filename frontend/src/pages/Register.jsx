import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNo: "",
    password: "",
    cash: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://papertrader-1.onrender.com/api/auth/register", formData);

      if (res.data.success) {
        alert("Registration successful.");
        login(res.data.accessToken);
        navigate("/");
      }
    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {["userName", "email", "phoneNo", "cash", "password"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field === "userName" ? "Username" : field === "phoneNo" ? "Phone Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  name={field}
                  type={field === "password" ? "password" : field === "cash" ? "number" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
