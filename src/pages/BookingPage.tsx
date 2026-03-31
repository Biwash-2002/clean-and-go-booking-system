import { useState, useEffect } from 'react';
import { Container, Grid, Card, Title, Text, TextInput, Select, Button, Stack, SimpleGrid, Box, LoadingOverlay, Divider, ActionIcon } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleMapComponent from '../components/GoogleMap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { WASH_PACKAGES, WASHING_CENTERS } from '../constants/data';
import { Car, MapPin, User, Smartphone, CheckCircle, Clock, Map as MapIcon, Navigation } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';

interface Booking {
    id: string;
    packageName: string;
    bookingDate: string;
    timeSlot: string;
    status: string;
    price: number;
    center?: string;
    [key: string]: any; // Allow other Formik values
}

const BookingPage = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>(() => {
        const stored = localStorage.getItem('car_wash_bookings');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load bookings', e);
            }
        }
        return [];
    });

    useEffect(() => {
        // Initialization moved to useState lazy initializer
    }, []);

    const getBookedSlots = (date: Date | null, centerId: string) => {
        if (!date || !centerId) return [];
        const dateString = date.toLocaleDateString();
        return bookings
            .filter(b => b.bookingDate && new Date(b.bookingDate).toLocaleDateString() === dateString && b.center === centerId)
            .map(b => b.timeSlot);
    };

    const generateTimeSlots = (duration: number) => {
        const slots = [];
        let currentMinutes = 8 * 60; // 08:00 AM
        const endMinutes = 20 * 60; // 08:00 PM

        while (currentMinutes <= (endMinutes - duration)) {
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
            const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            slots.push(timeString);
            currentMinutes += 30; // 30 min intervals
        }
        return slots;
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),
        vehicleNumber: Yup.string().required('Vehicle number is required'),
        package: Yup.string().required('Please select a service package'),
        bookingType: Yup.string().required('Required'),
        center: Yup.string().required('Please select a washing center'),
        timeSlot: Yup.string().required('Please pick a time slot'),
        bookingDate: Yup.date().required('Please select a date').nullable(),
        address: Yup.string().required('Address is required for verification'),
    });

    const prePkg = routerLocation.state?.pkgId || '';
    const preType = routerLocation.state?.planType || 'one-time';
    const selectedCenterId = routerLocation.state?.centerId || '';

    return (
        <Layout>
            <div className="py-12 bg-gray-50 min-h-screen">
                <Container size="lg">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title order={1} mb="2.5rem" ta="center" className="text-4xl font-extrabold tracking-tight">
                            Reserve Your <span className="text-primary-600">Perfect Clean</span>
                        </Title>
                    </motion.div>

                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            address: '',
                            vehicleNumber: '',
                            package: prePkg,
                            bookingType: preType,
                            center: selectedCenterId,
                            timeSlot: '',
                            message: '',
                            bookingDate: new Date(),
                            coords: null as { lat: number, lng: number } | null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            const token = localStorage.getItem('token');
                            
                            if (!token) {
                                notifications.show({
                                    title: 'Authentication Required',
                                    message: 'Please Login to confirm your booking and view history.',
                                    color: 'red',
                                    autoClose: 3000
                                });
                                navigate('/login', { state: { from: '/book' } });
                                return;
                            }

                            setIsSubmitting(true);
                            setTimeout(() => {
                                const pkg = WASH_PACKAGES.find(p => p.id === values.package);
                                const center = WASHING_CENTERS.find((c) => c.id === values.center);

                                const newBooking: Booking = {
                                    ...values,
                                    id: Math.random().toString(36).substr(2, 6).toUpperCase(),
                                    packageName: pkg?.name || '',
                                    price: pkg?.price || 0,
                                    centerName: center?.name || '',
                                    status: 'Confirmed',
                                    createdAt: new Date().toISOString(),
                                    bookingDate: values.bookingDate ? values.bookingDate.toISOString() : ''
                                };

                                const updated = [newBooking, ...bookings];
                                localStorage.setItem('car_wash_bookings', JSON.stringify(updated));
                                setBookings(updated);
                                
                                setIsSubmitting(false);
                                navigate('/booking-success', { state: { booking: newBooking } });
                            }, 1500);
                        }}
                    >
                        {({ values, touched, errors, setFieldValue, handleSubmit }) => {
                            const currentPkg = WASH_PACKAGES.find(p => p.id === values.package);
                            const currentCenter = WASHING_CENTERS.find((c) => c.id === values.center);
                            const bookedSlots = getBookedSlots(values.bookingDate, values.center);

                                                            const availableSlots = currentPkg ? generateTimeSlots(currentPkg.duration) : [];

                            return (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
                                    if (!submitter?.dataset?.submitButton) {
                                        return;
                                    }
                                    handleSubmit(e);
                                }}>
                                    <Box pos="relative">
                                        <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} zIndex={1000} />
                                        
                                        <Grid gutter="xl">
                                            <Grid.Col span={{ base: 12, md: 7 }}>
                                                <Stack gap="xl">
                                                    <Card shadow="sm" radius="xl" padding="xl" className="border-none shadow-blue-50">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-gray-800">
                                                            <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><User size={20} /></div>
                                                            User & Vehicle Information
                                                        </Title>
                                                        <SimpleGrid cols={{ base: 1, sm: 2 }} verticalSpacing="md">
                                                            <TextInput
                                                                label="First Name"
                                                                placeholder="Ram"
                                                                error={touched.firstName && errors.firstName}
                                                                onChange={(e) => setFieldValue('firstName', e.target.value)}
                                                                value={values.firstName}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            <TextInput
                                                                label="Last Name"
                                                                placeholder="Karki"
                                                                error={touched.lastName && errors.lastName}
                                                                onChange={(e) => setFieldValue('lastName', e.target.value)}
                                                                value={values.lastName}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            <TextInput
                                                                label="Email Address"
                                                                placeholder="ram@example.com"
                                                                error={touched.email && errors.email}
                                                                onChange={(e) => setFieldValue('email', e.target.value)}
                                                                value={values.email}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            <TextInput
                                                                label="Phone Number"
                                                                placeholder="98XXXXXXXX"
                                                                error={touched.phone && errors.phone}
                                                                onChange={(e) => setFieldValue('phone', e.target.value)}
                                                                value={values.phone}
                                                                radius="md"
                                                                leftSection={<Smartphone size={16} className="text-gray-400" />}
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                        </SimpleGrid>
                                                        <TextInput
                                                            mt="md"
                                                            label="Vehicle Number"
                                                            placeholder="BA-1-PA-1234"
                                                            error={touched.vehicleNumber && errors.vehicleNumber}
                                                            onChange={(e) => setFieldValue('vehicleNumber', e.target.value)}
                                                            value={values.vehicleNumber}
                                                            radius="md"
                                                            leftSection={<Car size={16} className="text-gray-400" />}
                                                            labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                        />
                                                    </Card>

                                                    <Card shadow="sm" radius="xl" padding="xl" className="border-none shadow-blue-50">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-gray-800">
                                                            <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><MapPin size={20} /></div>
                                                            Service Location Details
                                                        </Title>
                                                        <TextInput 
                                                            label="Pick-up/Drop-off Address"
                                                            placeholder="Click on map to pick location"
                                                            error={touched.address && errors.address}
                                                            value={values.address}
                                                            readOnly
                                                            radius="md"
                                                            mb="md"
                                                            leftSection={<Navigation size={16} className="text-primary-600" />}
                                                            rightSection={
                                                                <ActionIcon variant="light" color="blue" onClick={() => {
                                                                    notifications.show({title: 'Location Tool', message: 'Click anywhere on the map below to set your exact address.'});
                                                                }}>
                                                                    <MapIcon size={16} />
                                                                </ActionIcon>
                                                            }
                                                            labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                        />
                                                        
                                                        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner" style={{ height: '350px' }}>
                                                            <GoogleMapComponent
                                                                selectable
                                                                onLocationSelect={(coords, address) => {
                                                                    setFieldValue('coords', coords);
                                                                    setFieldValue('address', address);
                                                                    notifications.show({
                                                                        title: 'Location Captured',
                                                                        message: 'Address auto-filled from map selection.',
                                                                        color: 'blue'
                                                                    });
                                                                }}
                                                                locations={WASHING_CENTERS.map(c => ({
                                                                    ...c,
                                                                    id: c.id,
                                                                    name: c.name,
                                                                    address: c.address,
                                                                    coords: c.coords,
                                                                    location: c.location
                                                                }))}
                                                            />
                                                        </div>
                                                        <Text size="xs" mt="sm" c="dimmed" fs="italic">
                                                            Tip: You can select a center from map or pick any custom location.
                                                        </Text>
                                                    </Card>
                                                </Stack>
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, md: 5 }}>
                                                <Stack gap="xl">
                                                    <Card shadow="sm" radius="xl" padding="xl" className="border-none shadow-blue-50">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-gray-800">
                                                            <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><Clock size={20} /></div>
                                                            Service & Schedule
                                                        </Title>
                                                        
                                                        <Stack gap="md">
                                                            <Select
                                                                label="Plan Type"
                                                                data={[{ value: 'one-time', label: 'One-time Wash' }, { value: 'subscription', label: 'Monthly Subscription' }]}
                                                                value={values.bookingType}
                                                                onChange={(val) => {
                                                                    setFieldValue('bookingType', val || 'one-time');
                                                                    setFieldValue('package', '');
                                                                }}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            <Select
                                                                label="Select Package"
                                                                placeholder="Pick a package"
                                                                data={WASH_PACKAGES.filter(p => p.planType === values.bookingType).map(p => ({ value: p.id, label: p.name }))}
                                                                 value={values.package}
                                                                onChange={(val) => setFieldValue('package', val || '')}
                                                                error={touched.package && (errors.package as string)}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            <Select
                                                                label="Select Washing Center"
                                                                placeholder="Choose center"
                                                                data={WASHING_CENTERS.map(c => ({ value: c.id, label: c.name }))}
                                                                value={values.center}
                                                                onChange={(val) => {
                                                                    setFieldValue('center', val || '');
                                                                    setFieldValue('timeSlot', '');
                                                                }}
                                                                error={touched.center && (errors.center as string)}
                                                                radius="md"
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />
                                                            
                                                            <Divider my="sm" />

                                                            <DatePickerInput
                                                                label="Booking Date"
                                                                placeholder="Pick a date"
                                                                value={values.bookingDate}
                                                                onChange={(val) => {
                                                                    setFieldValue('bookingDate', val);
                                                                    setFieldValue('timeSlot', '');
                                                                }}
                                                                error={touched.bookingDate && (errors.bookingDate as string)}
                                                                radius="md"
                                                                minDate={new Date()}
                                                                hideOutsideDates
                                                                labelProps={{ className: 'mb-1 font-semibold text-gray-700' }}
                                                            />

                                                            <Text size="sm" fw={600} mb="xs" className="text-gray-700">Available Time Slots</Text>
                                                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                                                {values.package ? (
                                                                    availableSlots.map(slot => {
                                                                        const isBooked = bookedSlots.includes(slot);
                                                                        const isSelected = values.timeSlot === slot;
                                                                        return (
                                                                            <button
                                                                                key={slot}
                                                                                type="button"
                                                                                disabled={isBooked}
                                                                                onClick={() => setFieldValue('timeSlot', slot)}
                                                                                className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all
                                                                                    ${isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed italic' : 
                                                                                      isSelected ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 
                                                                                      'bg-white border border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50'}`}
                                                                            >
                                                                                {slot}
                                                                            </button>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="col-span-3 py-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                                        <Clock size={20} className="mx-auto mb-2 opacity-50" />
                                                                        <Text size="xs">Select package for slots</Text>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {touched.timeSlot && errors.timeSlot && (
                                                                <Text size="xs" mt="xs" c="red">{errors.timeSlot}</Text>
                                                            )}
                                                        </Stack>
                                                    </Card>

                                                    <Card shadow="xl" radius="xl" padding="xl" className="border-none bg-primary-600 text-white overflow-hidden relative">
                                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                                        <Title order={3} mb="xl" size="1.2rem">Booking Summary</Title>
                                                        <div className="space-y-4 relative z-10">
                                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                                <Text size="sm" className="opacity-80">Package</Text>
                                                                <Text fw={700} size="sm">{currentPkg?.name || '---'}</Text>
                                                            </div>
                                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                                <Text size="sm" className="opacity-80">Center</Text>
                                                                <Text fw={700} size="sm">{currentCenter?.name || '---'}</Text>
                                                            </div>
                                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                                <Text size="sm" className="opacity-80">Scheduled At</Text>
                                                                <Text fw={700} size="sm">{values.timeSlot || '---'}</Text>
                                                            </div>
                                                            <div className="flex justify-between items-center pt-2">
                                                                <Text size="lg" fw={800}>Total Price</Text>
                                                                <Text size="xl" fw={900}>Rs. {currentPkg?.price || 0}</Text>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            fullWidth 
                                                            size="lg" 
                                                            mt="xl" 
                                                            radius="md" 
                                                            type="submit" 
                                                            data-submit-button="true"
                                                            className="bg-white text-primary-600 hover:bg-gray-50 font-bold h-14"
                                                            disabled={isSubmitting}
                                                            leftSection={<CheckCircle size={20} />}
                                                        >
                                                            Confirm Booking
                                                        </Button>
                                                        <Text size="xs" mt="md" className="text-center opacity-70 italic">
                                                            Final price includes taxes and fees.
                                                        </Text>
                                                    </Card>
                                                </Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </form>
                            );
                        }}
                    </Formik>
                </Container>
            </div>
        </Layout>
    );
};

export default BookingPage;
