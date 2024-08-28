import { useState } from "react";
import { format } from 'date-fns';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const registerSchema = yup.object().shape({
    nome: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    dataNascimento: yup.string().required("required"),
    senha: yup.string().required("required"),
    cpf: yup.string().required("required"),
    rg: yup.string().required("required"),
    telefone: yup.string().required("required"),
    endereco: yup.string().required("required"),
    cep: yup.string().required("required"),
    uf: yup.string().required("required"),
    municipio: yup.string().required("required"),
})

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    senha: yup.string().required("required"),
});

const initialValuesRegister = {
    nome: undefined,
    email: undefined,
    dataNascimento: undefined,
    senha: undefined,
    cpf: undefined,
    rg: undefined,
    telefone: undefined,
    endereco: undefined,
    cep: undefined,
    uf: undefined,
    municipio: undefined,
}

const initialValuesLogin = {
    email: undefined,
    senha: undefined,
}

const Form = () => {
    const [ pageType, setPageType ] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const register = async (values, onSubmitProps) => {
        try {
            const formattedDate = format(new Date(values.dataNascimento), 'yyyy-MM-dd');
            values.dataNascimento = formattedDate;
    
            const savedUserResponse = await fetch(
                "http://localhost:3001/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                }
            );
            const savedUser = await savedUserResponse.json();
            onSubmitProps.resetForm();
    
            if (savedUser) {
                setPageType("login");
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values),
            }
        ); 

        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if(loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/home");
        }
    };

    const handleFormSubmit = async(values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if(isRegister) await register(values, onSubmitProps);
    };
    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
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
                        gridTemplateColumns="repeat(4,minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField 
                                    label="Nome"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.nome}
                                    name="nome"
                                    error={Boolean(touched.nome) && Boolean(errors.nome)}
                                    helperText={touched.nome && errors.nome}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="Data de Nascimento"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.dataNascimento}
                                    name="dataNascimento"
                                    error={Boolean(touched.dataNascimento) && Boolean(errors.dataNascimento)}
                                    helperText={touched.dataNascimento && errors.dataNascimento}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="CPF"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cpf}
                                    name="cpf"
                                    error={Boolean(touched.cpf) && Boolean(errors.cpf)}
                                    helperText={touched.cpf && errors.cpf}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="RG"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rg}
                                    name="rg"
                                    error={Boolean(touched.rg) && Boolean(errors.rg)}
                                    helperText={touched.rg && errors.rg}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="Telefone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.telefone}
                                    name="telefone"
                                    error={Boolean(touched.telefone) && Boolean(errors.telefone)}
                                    helperText={touched.telefone && errors.telefone}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="Endereço"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.endereco}
                                    name="endereco"
                                    error={Boolean(touched.endereco) && Boolean(errors.endereco)}
                                    helperText={touched.endereco && errors.endereco}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="CEP"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cep}
                                    name="cep"
                                    error={Boolean(touched.cep) && Boolean(errors.cep)}
                                    helperText={touched.cep && errors.cep}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="UF"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.uf}
                                    name="uf"
                                    error={Boolean(touched.uf) && Boolean(errors.uf)}
                                    helperText={touched.uf && errors.uf}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    label="Municipio"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.municipio}
                                    name="municipio"
                                    error={Boolean(touched.municipio) && Boolean(errors.municipio)}
                                    helperText={touched.municipio && errors.municipio}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </>
                        )}
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
                            label="Senha"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.senha}
                            name="senha"
                            error={Boolean(touched.senha) && Boolean(errors.senha)}
                            helperText={touched.senha && errors.senha}
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
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&: hover": { color: palette.primary.main }
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTRO"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                }
                            }}
                        >
                            {isLogin ? "Ainda não tem uma conta? Se cadastre aqui" : "Já tem uma conta? Faça o login aqui."}
                        </Typography>
                    </Box>
                </form>
            )}

        </Formik>
    )
}

export default Form;