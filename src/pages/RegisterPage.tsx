import { Container, Card, Title, Text, TextInput, Button, Stack, Box, Group, ThemeIcon, SimpleGrid, PasswordInput } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Car, Mail, Lock, User, Phone } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

const RegisterPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string()
                .matches(/^(?:(?:\+977-?)|0)\d{10}$|^\d{10}$/, 'Invalid Nepal phone number')
                .required('Phone number is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: (values, { setFieldError, setSubmitting }) => {
            // Load existing registered users (mock DB)
            const existingUsers: Array<{ email: string; password: string; name: string; phone: string; avatar: string; address: string }> =
                JSON.parse(localStorage.getItem('car_wash_registered_users') || '[]');

            // Check for duplicate email
            const alreadyRegistered = existingUsers.some(
                (u) => u.email.toLowerCase() === values.email.toLowerCase()
            );

            if (alreadyRegistered) {
                setFieldError('email', 'This email is already registered. Please log in.');
                setSubmitting(false);
                notifications.show({
                    title: 'Email Already Registered',
                    message: 'An account with this email already exists. Please log in.',
                    color: 'red',
                    autoClose: 5000,
                });
                return;
            }

            // Build new user record (store password for login validation)
            const newUser = {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                password: values.password, // stored for client-side auth check
                phone: values.phone,
                address: 'Not available',
                avatar: `https://ui-avatars.com/api/?name=${values.firstName}+${values.lastName}&background=random`,
            };

            // Persist to mock DB
            existingUsers.push(newUser);
            localStorage.setItem('car_wash_registered_users', JSON.stringify(existingUsers));

            notifications.show({
                title: 'Account Created Successfully!',
                message: 'Your account is ready. Please log in to continue.',
                color: 'green',
                autoClose: 5000,
            });
            navigate('/login');
        },
    });

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f8fafc', minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '40px 0' } as React.CSSProperties}>
                <Container size="sm" w="100%">
                    <Card padding="xl" className="luxury-card border-none shadow-xl p-10">
                        <Stack align="center" mb="xl">
                            <ThemeIcon size={52} radius="xl" className="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                                <Car size={26} />
                            </ThemeIcon>
                            <Title order={2} className="font-sans font-black uppercase tracking-tight text-slate-900 mt-2 text-2xl">Create Account</Title>
                            <Text className="text-slate-400 font-semibold" size="sm">Join Nepal's premier car wash community</Text>
                        </Stack>

                        <form onSubmit={formik.handleSubmit}>
                            <Stack gap="md">
                                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                    <TextInput
                                        label="First Name"
                                        placeholder="Ram"
                                        leftSection={<User size={16} className="text-slate-400" />}
                                        {...formik.getFieldProps('firstName')}
                                        error={formik.touched.firstName && formik.errors.firstName}
                                        size="md"
                                        radius="md"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                    />
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Karki"
                                        leftSection={<User size={16} className="text-slate-400" />}
                                        {...formik.getFieldProps('lastName')}
                                        error={formik.touched.lastName && formik.errors.lastName}
                                        size="md"
                                        radius="md"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                    />
                                </SimpleGrid>

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

                                <TextInput
                                    label="Phone Number"
                                    placeholder="+977-98XXXXXXXX"
                                    leftSection={<Phone size={16} className="text-slate-400" />}
                                    {...formik.getFieldProps('phone')}
                                    error={formik.touched.phone && formik.errors.phone}
                                    size="md"
                                    radius="md"
                                    labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                />

                                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                    <PasswordInput
                                        label="Password"
                                        placeholder="Min 8 chars"
                                        leftSection={<Lock size={16} className="text-slate-400" />}
                                        {...formik.getFieldProps('password')}
                                        error={formik.touched.password && formik.errors.password}
                                        size="md"
                                        radius="md"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                    />
                                    <PasswordInput
                                        label="Confirm Password"
                                        placeholder="Repeat password"
                                        leftSection={<Lock size={16} className="text-slate-400" />}
                                        {...formik.getFieldProps('confirmPassword')}
                                        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                        size="md"
                                        radius="md"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                    />
                                </SimpleGrid>

                                <Button 
                                    fullWidth 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 shadow-lg shadow-indigo-600/10 rounded-xl" 
                                    size="md" 
                                    radius="md" 
                                    mt="md" 
                                    type="submit"
                                    loading={formik.isSubmitting}
                                >
                                    Create Account
                                </Button>
                            </Stack>
                        </form>

                        <Group justify="center" mt="xl">
                            <Text size="sm" className="text-slate-400 font-semibold">Already have an account?</Text>
                            <Text
                                size="sm"
                                component={Link}
                                to="/login"
                                fw={700}
                                className="text-indigo-600 hover:text-indigo-700 hover:underline"
                                style={{ textDecoration: 'none' } as React.CSSProperties}
                            >
                                Login Here
                            </Text>
                        </Group>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
};

export default RegisterPage;
