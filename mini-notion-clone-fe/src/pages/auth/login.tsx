import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../../api/axios";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Paper,
  Link,
} from "@mui/material";
import { useSnackbar } from "../../contexts/snackbar-context";
import { AxiosError } from "axios";
import { useAuth } from "../../contexts/auth-context";

interface LoginForm {
  email: string;
  password: string;
}

interface ErrorResponse {
  message?: string;
  errors?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onChange" });

  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { setUser } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/users/login", data, { withCredentials: true });
      setUser(res.data.data);
      navigate("/");
      showMessage("Login berhasil!", "success");
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Login gagal";
      showMessage(message, "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>

            <Typography variant="body2" align="center">
              Belum punya akun?{" "}
              <Link component={RouterLink} to="/register">
                Daftar di sini
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
