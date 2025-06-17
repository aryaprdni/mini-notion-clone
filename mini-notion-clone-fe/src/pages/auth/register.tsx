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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  message?: string;
  errors?: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const navigate = useNavigate();
  const { showMessage } = useSnackbar();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/users", data);
      showMessage("Register berhasil! Mengarahkan ke login...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Register gagal";
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
          Register
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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>

            <Typography variant="body2" align="center">
              Sudah punya akun?{" "}
              <Link component={RouterLink} to="/login">
                Masuk di sini
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
