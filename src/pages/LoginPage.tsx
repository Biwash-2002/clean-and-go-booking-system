import { Container, Card, Title, Text, TextInput, Button, Stack, Box, Group, ThemeIcon, PasswordInput, Alert } from '@mantine/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Car, Mail, Lock, AlertCircle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface RegisteredUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    avatar: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/profile';
    const [authError, setAuthError] = useState<string | null>(null);

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
        onSubmit: (values, { setSubmitting }) => {
            setAuthError(null);

            // Load all registered users from the mock DB
            const registeredUsers: RegisteredUser[] = JSON.parse(
                localStorage.getItem('car_wash_registered_users') || '[]'
            );

            // Find a user whose email matches (case-insensitive)
            const matchedUser = registeredUsers.find(
                (u) => u.email.toLowerCase() === values.email.toLowerCase()
            );

            // Validate: email must exist and password must match exactly
            if (!matchedUser || matchedUser.password !== values.password) {
                setAuthError('Invalid credentials. Please register first or check your email and password.');
                setSubmitting(false);
                notifications.show({
                    title: 'Login Failed',
                    message: 'Invalid email or password. Please register first.',
                    color: 'red',
                    autoClose: 5000,
                });
                return;
            }

            // Credentials are valid — set the active session
            localStorage.setItem('token', 'simple-auth-token-123');
            // Persist the email so bookingStorage can scope history to this user
            localStorage.setItem('car_wash_logged_in_email', matchedUser.email.trim().toLowerCase());
            localStorage.setItem('car_wash_user', JSON.stringify({
                name: matchedUser.name,
                email: matchedUser.email,
                phone: matchedUser.phone,
                address: matchedUser.address,
                avatar: matchedUser.avatar,
            }));

            notifications.show({
                title: 'Welcome Back!',
                message: `Hello, ${matchedUser.name}! Login successful.`,
                color: 'green',
            });
            navigate(from, { replace: true });
        },
    });

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f8fafc', minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '40px 0' } as React.CSSProperties}>
                <Container size="xs" w="100%">
                    <Card padding="xl" className="luxury-card border-none shadow-xl p-10">
                        <Stack align="center" mb="xl">
                            <ThemeIcon size={52} radius="xl" className="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                                <Car size={26} />
                            </ThemeIcon>
                            <Title order={2} className="font-sans font-black uppercase tracking-tight text-slate-900 mt-2 text-2xl">Welcome Back</Title>
                            <Text className="text-slate-400 font-semibold" size="sm">Login to manage your bookings</Text>
                        </Stack>

                        <form onSubmit={formik.handleSubmit}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email Address"
                                    placeholder="your@email.com"
                                    leftSection={<Mail size={16} className="text-slate-400" />}
                                    {...formik.getFieldProps('email')}
                                    error={formik.touched.email && formik.errors.email}
                                    size="md"
                                    radius="md"
                                    labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    leftSection={<Lock size={16} className="text-slate-400" />}
                                    {...formik.getFieldProps('password')}
                                    error={formik.touched.password && formik.errors.password}
                                    size="md"
                                    radius="md"
                                    labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                />
                                {authError && (
                                    <Alert
                                        icon={<AlertCircle size={16} />}
                                        title="Login Failed"
                                        color="red"
                                        radius="md"
                                        variant="light"
                                        mt="xs"
                                    >
                                        {authError}
                                    </Alert>
                                )}
                                <Button 
                                    fullWidth 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 shadow-lg shadow-indigo-600/10 rounded-xl" 
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
                            <Text size="sm" className="text-slate-400 font-semibold">Don't have an account?</Text>
                            <Text
                                size="sm"
                                component={Link}
                                to="/register"
                                fw={700}
                                className="text-indigo-600 hover:text-indigo-700 hover:underline"
                                style={{ textDecoration: 'none' } as React.CSSProperties}
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
