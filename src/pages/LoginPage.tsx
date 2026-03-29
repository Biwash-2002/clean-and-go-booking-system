import { Container, Card, Title, Text, TextInput, Button, Stack, Box, Group, ThemeIcon, PasswordInput } from '@mantine/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Car, Mail, Lock } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/profile';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Login values:', values);
            // Mock authentication
            localStorage.setItem('token', 'simple-auth-token-123');
            
            // Set user info to avoid "Ram Karki" default
            const name = values.email.split('@')[0];
            localStorage.setItem('car_wash_user', JSON.stringify({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                email: values.email,
                phone: '9812345678',
                address: 'Kathmandu, Nepal',
                avatar: `https://ui-avatars.com/api/?name=${name}+User&background=random`
            }));

            notifications.show({
                title: 'Welcome Back!',
                message: 'Login successful! Redirecting...',
                color: 'green',
            });
            navigate(from, { replace: true });
        },
    });

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f1f5f9', minHeight: '80vh', display: 'flex', alignItems: 'center' } as any}>
                <Container size="xs" w="100%">
                    <Card padding="xl" radius="lg" shadow="xl" withBorder>
                        <Stack align="center" mb="xl">
                            <ThemeIcon size={50} radius="xl" className="gradient-button">
                                <Car size={30} />
                            </ThemeIcon>
                            <Title order={2}>Welcome Back</Title>
                            <Text c="dimmed" size="sm">Login to manage your bookings</Text>
                        </Stack>

                        <form onSubmit={formik.handleSubmit}>
                            <Stack>
                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    leftSection={<Mail size={16} />}
                                    {...formik.getFieldProps('email')}
                                    error={formik.touched.email && formik.errors.email}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    leftSection={<Lock size={16} />}
                                    {...formik.getFieldProps('password')}
                                    error={formik.touched.password && formik.errors.password}
                                />
                                <Button 
                                    fullWidth 
                                    className="gradient-button" 
                                    size="md" 
                                    radius="md" 
                                    mt="md" 
                                    type="submit"
                                    loading={formik.isSubmitting}
                                >
                                    Login
                                </Button>
                            </Stack>
                        </form>

                        <Group justify="center" mt="xl">
                            <Text size="sm" c="dimmed">Don't have an account?</Text>
                            <Text
                                size="sm"
                                component={Link as any}
                                to="/register"
                                fw={600}
                                style={{ color: '#0061ff', textDecoration: 'none' } as any}
                            >
                                Register Now
                            </Text>
                        </Group>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
};

export default LoginPage;
