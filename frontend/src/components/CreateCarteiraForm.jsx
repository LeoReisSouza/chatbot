import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useSelector } from "react-redux";

const validationSchema = yup.object().shape({
    nome: yup.string().required('O nome da carteira é obrigatório'),
    descricao: yup.string().required('A descrição da carteira é obrigatória'),
    risco: yup.string().required('O nível de risco da carteira é obrigatório'),
});

const CreateCarteiraForm = ({ onSuccess, user_id }) => {
    const token = useSelector((state) => state.token);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch(`http://localhost:3001/users/createcarteira/${user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({...values, userId: user_id}),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar a carteira');
            }
            onSuccess(); 
            resetForm();
        } catch (error) {
            console.error('Erro ao criar a carteira:', error);
        }
    };

    return (
        <Formik
            initialValues={{
                nome: undefined,
                descricao: undefined,
                risco: undefined,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched }) => (
                <Form>
                    <Box>
                        <Box>
                            <Field
                                name="nome"
                                as={TextField}
                                label="Nome da Carteira"
                                error={touched.nome && !!errors.nome}
                                helperText={touched.nome && errors.nome}
                                fullWidth
                                margin="normal"
                            />
                            <Field
                                name="descricao"
                                as={TextField}
                                label="Descrição da Carteira"
                                error={touched.descricao && !!errors.descricao}
                                helperText={touched.descricao && errors.descricao}
                                fullWidth
                                margin="normal"
                            />
                            <Field
                                name="risco"
                                as={TextField}
                                label="Risco da Carteira"
                                error={touched.risco && !!errors.risco}
                                helperText={touched.risco && errors.risco}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                        <Button type="submit" variant="contained" color="primary">
                            Criar Carteira
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default CreateCarteiraForm;