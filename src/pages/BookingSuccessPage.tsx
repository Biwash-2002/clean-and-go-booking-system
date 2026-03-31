import { useEffect } from 'react';
import { Container, Title, Text, Button, Stack, Box } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const BookingSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking;

    useEffect(() => {
        if (!booking) {
            navigate('/history');
        }
    }, [booking, navigate]);

    if (!booking) return null;

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center py-12">
                <Container size="sm" className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-8"
                            >
                                <CheckCircle2 size={48} />
                            </motion.div>

                            <Title order={1} className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
                                Booking Confirmed!
                            </Title>
                            
                            <Text className="text-gray-600 text-lg mb-10">
                                Your car wash slot has been successfully booked. We've sent a confirmation to your email.
                            </Text>

                            <div className="bg-blue-50 rounded-2xl p-6 mb-10 text-left space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <Text className="text-xs font-bold text-blue-800 uppercase tracking-wider">Date & Time</Text>
                                        <Text className="font-semibold text-gray-900">
                                            {new Date(booking.bookingDate).toLocaleDateString()} at {booking.timeSlot}
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <Text className="text-xs font-bold text-blue-800 uppercase tracking-wider">Location</Text>
                                        <Text className="font-semibold text-gray-900">{booking.centerName}</Text>
                                    </div>
                                </div>
                            </div>

                            <Stack>
                                <Button 
                                    size="lg" 
                                    radius="xl" 
                                    className="bg-primary-600 hover:bg-primary-700 h-14"
                                    onClick={() => navigate('/history')}
                                    rightSection={<ArrowRight size={18} />}
                                >
                                    View Booking History
                                </Button>
                                <Button 
                                    variant="subtle" 
                                    size="lg" 
                                    radius="xl"
                                    onClick={() => navigate('/')}
                                    className="text-gray-500 hover:text-gray-900"
                                >
                                    Back to Home
                                </Button>
                            </Stack>
                        </Box>
                    </motion.div>
                </Container>
            </div>
        </Layout>
    );
};

export default BookingSuccessPage;
