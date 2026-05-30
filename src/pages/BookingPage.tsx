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
import ErrorBoundary from '../components/ErrorBoundary';
import { loadUserBookings, addUserBooking } from '../utils/bookingStorage';

interface Booking {
    id: string;
    packageName: string;
    bookingDate: string;
    timeSlot: string;
    status: string;
    price: number;
    center?: string;
    centerName?: string;
    createdAt?: string;
    coords?: { lat: number; lng: number } | null;
    address?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    vehicleNumber?: string;
    bookingType?: string;
    message?: string;
    package?: string;
}

const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const timeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
};

const minutesToTimeStr = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const isToday = (dateVal: any): boolean => {
    if (!dateVal) return false;
    const date = dateVal instanceof Date ? dateVal : new Date(dateVal);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const getCurrentTimeMinutes = (): number => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

const isSlotOverlapping = (
    candidateStart: number,
    candidateDuration: number,
    bookedIntervals: { start: number; end: number }[]
): boolean => {
    return bookedIntervals.some(interval => {
        return candidateStart < interval.end && (candidateStart + candidateDuration) > interval.start;
    });
};

const BookingPage = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>(() => loadUserBookings<Booking>());

    useEffect(() => {
        // Initialization moved to useState lazy initializer
    }, []);

    const generateTimeSlots = (duration: number) => {
        const slots: string[] = [];
        let currentMinutes = 8 * 60; // 08:00 AM
        const endMinutes = 20 * 60; // 08:00 PM

        while (currentMinutes <= (endMinutes - duration)) {
            slots.push(minutesToTimeStr(currentMinutes));
            currentMinutes += 15; // 15-minute increments for dynamic booking options
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
            <div className="py-16 bg-slate-50 min-h-screen">
                <Container size="lg">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title order={1} mb="3rem" ta="center" className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight text-slate-900">
                            Reserve Your <span className="text-indigo-600">Perfect Clean</span>
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

                            const pkg = WASH_PACKAGES.find(p => p.id === values.package);
                            const center = WASHING_CENTERS.find((c) => c.id === values.center);
                            const bDate = values.bookingDate ? (values.bookingDate instanceof Date ? values.bookingDate : new Date(values.bookingDate)) : null;

                            if (!bDate || isNaN(bDate.getTime()) || !values.center || !pkg) {
                                notifications.show({
                                    title: 'Invalid Booking Data',
                                    message: 'Please fill in all details before confirming.',
                                    color: 'red'
                                });
                                return;
                            }

                            // Calculate overlapping bookings
                            const bookedIntervals = bookings
                                .filter(b => {
                                    if (!b || !b.bookingDate || !b.center) return false;
                                    const existingDate = new Date(b.bookingDate);
                                    if (isNaN(existingDate.getTime())) return false;
                                    return existingDate.toLocaleDateString() === bDate.toLocaleDateString() && b.center === values.center;
                                })
                                .map(b => {
                                    const start = timeToMinutes(b.timeSlot);
                                    const bookedPkg = WASH_PACKAGES.find(p => p.id === b.package || p.name === b.packageName);
                                    const duration = bookedPkg ? bookedPkg.duration : 30;
                                    return { start, end: start + duration };
                                });

                            const slotMinutes = timeToMinutes(values.timeSlot);
                            const isOverlapping = isSlotOverlapping(slotMinutes, pkg.duration, bookedIntervals);
                            const isPast = isToday(bDate) && slotMinutes <= getCurrentTimeMinutes();

                            if (isOverlapping || isPast) {
                                notifications.show({
                                    title: 'Slot Unavailable',
                                    message: 'The selected time slot overlaps with another booking or is in the past. Please choose a different slot.',
                                    color: 'red',
                                    autoClose: 5000
                                });
                                return;
                            }

                            setIsSubmitting(true);
                            setTimeout(() => {
                                 const newBooking: Booking = {
                                     ...values,
                                     id: Math.random().toString(36).substr(2, 6).toUpperCase(),
                                     packageName: pkg?.name || '',
                                     price: pkg?.price || 0,
                                     centerName: center?.name || '',
                                     status: 'Confirmed',
                                     createdAt: new Date().toISOString(),
                                     bookingDate: bDate.toISOString()
                                 };

                                // Save to THIS user's scoped booking history
                                const updated = addUserBooking<Booking>(newBooking);
                                setBookings(updated);
                                
                                setIsSubmitting(false);
                                navigate('/booking-success', { state: { booking: newBooking } });
                            }, 1500);
                        }}
                    >
                        {({ values, touched, errors, setFieldValue, handleSubmit }) => {
                            const currentPkg = WASH_PACKAGES.find(p => p.id === values.package);
                            const currentCenter = WASHING_CENTERS.find((c) => c.id === values.center);
                            
                            const bookedIntervals = (values.bookingDate && values.center) ? bookings
                                .filter(b => {
                                    if (!b || !b.bookingDate || !b.center) return false;
                                    const bDate = new Date(b.bookingDate);
                                    if (isNaN(bDate.getTime())) return false;
                                    
                                    const selectedDate = values.bookingDate ? (values.bookingDate instanceof Date ? values.bookingDate : new Date(values.bookingDate)) : null;
                                    if (!selectedDate || isNaN(selectedDate.getTime())) return false;
                                    
                                    return bDate.toLocaleDateString() === selectedDate.toLocaleDateString() && b.center === values.center;
                                })
                                .map(b => {
                                    const start = timeToMinutes(b.timeSlot);
                                    const bookedPkg = WASH_PACKAGES.find(p => p.id === b.package || p.name === b.packageName);
                                    const duration = bookedPkg ? bookedPkg.duration : 30;
                                    return { start, end: start + duration };
                                }) : [];

                            const availableSlots = currentPkg ? generateTimeSlots(currentPkg.duration) : [];

                            return (
                                <form onSubmit={handleSubmit}>
                                    <Box pos="relative">
                                        <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} zIndex={1000} />
                                        
                                        <Grid gutter="xl">
                                            <Grid.Col span={{ base: 12, md: 7 }}>
                                                <Stack gap="xl">
                                                    <Card padding="xl" className="luxury-card">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-slate-900 font-sans font-black uppercase tracking-tight">
                                                            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shadow-sm"><User size={18} /></div>
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
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />
                                                            <TextInput
                                                                label="Last Name"
                                                                placeholder="Karki"
                                                                error={touched.lastName && errors.lastName}
                                                                onChange={(e) => setFieldValue('lastName', e.target.value)}
                                                                value={values.lastName}
                                                                radius="md"
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />
                                                            <TextInput
                                                                label="Email Address"
                                                                placeholder="ram@example.com"
                                                                error={touched.email && errors.email}
                                                                onChange={(e) => setFieldValue('email', e.target.value)}
                                                                value={values.email}
                                                                radius="md"
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />
                                                            <TextInput
                                                                label="Phone Number"
                                                                placeholder="98XXXXXXXX"
                                                                error={touched.phone && errors.phone}
                                                                onChange={(e) => setFieldValue('phone', e.target.value)}
                                                                value={values.phone}
                                                                radius="md"
                                                                size="md"
                                                                leftSection={<Smartphone size={16} className="text-slate-400" />}
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
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
                                                            size="md"
                                                            leftSection={<Car size={18} className="text-slate-400" />}
                                                            labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                        />
                                                    </Card>

                                                    <Card padding="xl" className="luxury-card">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-slate-900 font-sans font-black uppercase tracking-tight">
                                                            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shadow-sm"><MapPin size={18} /></div>
                                                            Service Location Details
                                                        </Title>
                                                        <TextInput 
                                                            label="Pick-up/Drop-off Address"
                                                            placeholder="Click on map to pick location"
                                                            error={touched.address && errors.address}
                                                            value={values.address}
                                                            readOnly
                                                            radius="md"
                                                            size="md"
                                                            mb="md"
                                                            leftSection={<Navigation size={18} className="text-indigo-600" />}
                                                            rightSection={
                                                                <ActionIcon type="button" variant="light" color="indigo" onClick={() => {
                                                                    notifications.show({title: 'Location Tool', message: 'Click anywhere on the map below to set your exact address.'});
                                                                }}>
                                                                    <MapIcon size={16} />
                                                                </ActionIcon>
                                                            }
                                                            labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                        />
                                                        
                                                        <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-inner" style={{ height: '350px' }}>
                                                            <GoogleMapComponent
                                                                selectable
                                                                onLocationSelect={(coords, address) => {
                                                                    setFieldValue('coords', coords);
                                                                    setFieldValue('address', address);
                                                                    notifications.show({
                                                                        title: 'Location Captured',
                                                                        message: 'Address auto-filled from map selection.',
                                                                        color: 'indigo'
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
                                                        <Text size="xs" mt="sm" c="dimmed" fs="italic" fw={600} className="text-slate-400">
                                                            Tip: You can select a center from map or pick any custom location.
                                                        </Text>
                                                    </Card>
                                                </Stack>
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, md: 5 }}>
                                                <Stack gap="xl">
                                                    <Card padding="xl" className="luxury-card">
                                                        <Title order={3} mb="xl" size="1.2rem" className="flex items-center gap-3 text-slate-900 font-sans font-black uppercase tracking-tight">
                                                            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shadow-sm"><Clock size={18} /></div>
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
                                                                    setFieldValue('timeSlot', '');
                                                                }}
                                                                radius="md"
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />
                                                            <Select
                                                                label="Select Package"
                                                                placeholder="Pick a package"
                                                                data={WASH_PACKAGES.filter(p => p.planType === values.bookingType).map(p => ({ value: p.id, label: p.name }))}
                                                                value={values.package}
                                                                onChange={(val) => {
                                                                    setFieldValue('package', val || '');
                                                                    setFieldValue('timeSlot', '');
                                                                }}
                                                                error={touched.package && (errors.package as string)}
                                                                radius="md"
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
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
                                                                size="md"
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />
                                                            
                                                            <Divider my="xs" className="border-slate-100" />
 
                                                            <DatePickerInput
                                                                label="Booking Date"
                                                                placeholder="Pick a date"
                                                                value={values.bookingDate ? (values.bookingDate instanceof Date ? values.bookingDate : new Date(values.bookingDate)) : null}
                                                                onChange={(val) => {
                                                                    setFieldValue('bookingDate', val);
                                                                    setFieldValue('timeSlot', '');
                                                                }}
                                                                error={touched.bookingDate && (errors.bookingDate as string)}
                                                                radius="md"
                                                                size="md"
                                                                minDate={getStartOfToday()}
                                                                hideOutsideDates
                                                                labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                                            />

                                                            <Text size="xs" fw={700} className="text-slate-500 uppercase tracking-wider mb-0.5">Available Time Slots</Text>
                                                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                                                {values.package ? (
                                                                    (() => {
                                                                        const validSlots = availableSlots.filter(slot => {
                                                                            const slotMinutes = timeToMinutes(slot);
                                                                            const isOverlapping = currentPkg ? isSlotOverlapping(slotMinutes, currentPkg.duration, bookedIntervals) : false;
                                                                            const isPast = isToday(values.bookingDate) && slotMinutes <= getCurrentTimeMinutes();
                                                                            return !isOverlapping && !isPast;
                                                                        });

                                                                        if (validSlots.length === 0) {
                                                                            return (
                                                                                <div className="col-span-3 py-6 text-center text-red-500 bg-red-50/50 rounded-xl border border-dashed border-red-100">
                                                                                    <Clock size={18} className="mx-auto mb-1 opacity-70" />
                                                                                    <Text size="xs" fw={700}>No slots available for this date</Text>
                                                                                </div>
                                                                            );
                                                                        }

                                                                        return validSlots.map(slot => {
                                                                            const isSelected = values.timeSlot === slot;
                                                                            return (
                                                                                <button
                                                                                    key={slot}
                                                                                    type="button"
                                                                                    onClick={() => setFieldValue('timeSlot', slot)}
                                                                                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all duration-200 border
                                                                                        ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border-indigo-600' : 
                                                                                          'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40'}`}
                                                                                >
                                                                                    {slot}
                                                                                </button>
                                                                            );
                                                                        });
                                                                    })()
                                                                ) : (
                                                                    <div className="col-span-3 py-6 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                                        <Clock size={18} className="mx-auto mb-1 opacity-50" />
                                                                        <Text size="xs" fw={700}>Select package for slots</Text>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {touched.timeSlot && errors.timeSlot && (
                                                                <Text size="xs" mt="xs" c="red" fw={600}>{errors.timeSlot}</Text>
                                                            )}
                                                        </Stack>
                                                    </Card>

                                                    <Card padding="xl" className="invoice-container border-none overflow-hidden relative">
                                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                                                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                                                        
                                                        <div className="invoice-header mb-6 relative z-10">
                                                            <Title order={3} size="1.25rem" className="text-white uppercase tracking-wider font-sans font-black flex justify-between items-center">
                                                                <span>Booking Summary</span>
                                                                <span className="luxury-badge gold" style={{ border: 'none', background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>Invoice</span>
                                                            </Title>
                                                        </div>

                                                        <div className="space-y-1 relative z-10 mb-8">
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Plan Type</Text>
                                                                <Text fw={700} size="sm" className="text-white">
                                                                    {values.bookingType === 'subscription' ? 'Monthly Membership' : 'One-Time Wash'}
                                                                </Text>
                                                            </div>
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Selected Package</Text>
                                                                <Text fw={700} size="sm" className="text-indigo-300">{currentPkg?.name || '---'}</Text>
                                                            </div>
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Washing Center</Text>
                                                                <Text fw={700} size="sm" className="text-white">{currentCenter?.name || '---'}</Text>
                                                            </div>
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Address & Location</Text>
                                                                <Text fw={600} size="xs" className="text-slate-300 max-w-[200px] truncate">{values.address || '---'}</Text>
                                                            </div>
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Date & Time</Text>
                                                                <Text fw={700} size="sm" className="text-white">
                                                                    {values.bookingDate ? new Date(values.bookingDate).toLocaleDateString() : '---'} {values.timeSlot ? `@ ${values.timeSlot}` : ''}
                                                                </Text>
                                                            </div>
                                                            <div className="invoice-item">
                                                                <Text size="xs" className="text-slate-400 font-bold uppercase tracking-wider">Vehicle ID</Text>
                                                                <Text fw={700} size="sm" className="font-mono text-white">{values.vehicleNumber || '---'}</Text>
                                                            </div>
                                                        </div>

                                                        <div className="invoice-total relative z-10">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <Text size="sm" fw={800} className="text-white uppercase tracking-wider">Total Price</Text>
                                                                    <Text size="xs" className="text-slate-400">Inclusive of VAT & Fees</Text>
                                                                </div>
                                                                <Text size="2rem" fw={900} className="text-amber-400 font-sans">Rs. {currentPkg?.price || 0}</Text>
                                                            </div>
                                                        </div>

                                                        <Button 
                                                            fullWidth 
                                                            size="lg" 
                                                            mt="xl" 
                                                            radius="md" 
                                                            type="submit" 
                                                            data-submit-button="true"
                                                            className="bg-white text-indigo-950 hover:bg-slate-50 font-black tracking-wide h-14 transition-all shadow-lg rounded-xl"
                                                            disabled={isSubmitting}
                                                            leftSection={<CheckCircle size={20} className="text-green-600" />}
                                                        >
                                                            Confirm Booking
                                                        </Button>
                                                        <Text size="xs" mt="md" className="text-center text-slate-400 italic">
                                                            A digital copy of invoice will be sent upon scheduling.
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

const BookingPageWithErrorBoundary = () => (
    <ErrorBoundary>
        <BookingPage />
    </ErrorBoundary>
);

export default BookingPageWithErrorBoundary;
