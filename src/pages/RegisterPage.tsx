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
        onSubmit: (values) => {
            console.log('Register values:', values);
            
            // Simulating database storage
            localStorage.setItem('car_wash_user', JSON.stringify({
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                phone: values.phone,
                address: 'Not available',
                avatar: `https://ui-avatars.com/api/?name=${values.firstName}+${values.lastName}&background=random`
            }));
            localStorage.removeItem('car_wash_bookings'); // Clear history for fresh start

            notifications.show({
                title: 'Account Created Successfully!',
                message: 'Your account is ready. Please log in to continue.',
                color: 'green',
                autoClose: 5000
            });
            navigate('/login');
        },
    });

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f1f5f9', minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '40px 0' } as any}>
                <Container size="sm" w="100%">
                    <Card padding="xl" radius="lg" shadow="xl" withBorder>
                        <Stack align="center" mb="xl">
                            <ThemeIcon size={50} radius="xl" className="gradient-button">
                                <Car size={30} />
                            </ThemeIcon>
                            <Title order={2}>Create Account</Title>
                            <Text c="dimmed" size="sm">Join Nepal's premier car wash community</Text>
                        </Stack>

                        <form onSubmit={formik.handleSubmit}>
                            <Stack>
                                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                    <TextInput
                                        label="First Name"
                                        placeholder="Ram"
                                        leftSection={<User size={16} />}
                                        {...formik.getFieldProps('firstName')}
                                        error={formik.touched.firstName && formik.errors.firstName}
                                    />
                                    <TextInput
                                        label="Last Name"
                                        placeholder="karki"
                                        leftSection={<User size={16} />}
                                        {...formik.getFieldProps('lastName')}
                                        error={formik.touched.lastName && formik.errors.lastName}
                                    />
                                </SimpleGrid>

                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    leftSection={<Mail size={16} />}
                                    {...formik.getFieldProps('email')}
                                    error={formik.touched.email && formik.errors.email}
                                />

                                <TextInput
                                    label="Phone Number"
                                    placeholder="+977-98XXXXXXXX"
                                    leftSection={<Phone size={16} />}
                                    {...formik.getFieldProps('phone')}
                                    error={formik.touched.phone && formik.errors.phone}
                                />

                                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                    <PasswordInput
                                        label="Password"
                                        placeholder="Min 8 chars"
                                        leftSection={<Lock size={16} />}
                                        {...formik.getFieldProps('password')}
                                        error={formik.touched.password && formik.errors.password}
                                    />
                                    <PasswordInput
                                        label="Confirm Password"
                                        placeholder="Repeat password"
                                        leftSection={<Lock size={16} />}
                                        {...formik.getFieldProps('confirmPassword')}
                                        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    />
                                </SimpleGrid>

                                <Button 
                                    fullWidth 
                                    className="gradient-button" 
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
                            <Text size="sm" c="dimmed">Already have an account?</Text>
                            <Text
                                size="sm"
                                component={Link as any}
                                to="/login"
                                fw={600}
                                style={{ color: '#0061ff', textDecoration: 'none' } as any}
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
