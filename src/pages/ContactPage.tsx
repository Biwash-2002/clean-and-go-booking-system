import { Container, Title, Text, SimpleGrid, Card, Stack, TextInput, Textarea, Button, ThemeIcon, Box, Grid, Group, Badge } from '@mantine/core';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const contactInfo = [
        { icon: Phone, title: 'Phone', value: '+977-9804851228', color: 'indigo', desc: 'Mon–Sat, 8am–7pm' },
        { icon: Mail, title: 'Email', value: 'Clean&go2026@gmail.com', color: 'indigo', desc: 'Reply within 24 hours' },
        { icon: MapPin, title: 'Office', value: 'Lazimpat, Kathmandu', color: 'indigo', desc: 'Head Office' },
        { icon: MessageCircle, title: 'WhatsApp', value: '+977-9801111111', color: 'indigo', desc: 'Quick chat support' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        notifications.show({
            title: 'Message Sent!',
            message: 'Thank you for contacting us. We will get back to you within 24 hours.',
            color: 'green',
            icon: <CheckCircle size={16} />,
        });
    };

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' } as React.CSSProperties}>
                {/* Hero Banner */}
                <Box style={{
                    background: 'linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.90)), url("https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=2000")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '44vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                } as React.CSSProperties}>
                    <Container size="md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Badge size="md" variant="light" color="indigo" radius="xl" className="mb-4 font-black uppercase tracking-widest px-4">
                                Get In Touch
                            </Badge>
                            <Title order={1} className="font-sans font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900 } as React.CSSProperties}>
                                Contact <span className="text-indigo-400">Our Team</span>
                            </Title>
                            <Text size="xl" mt="md" style={{ opacity: 0.8, fontWeight: 500 } as React.CSSProperties}>
                                We're here to help you keep your vehicle in pristine condition.
                            </Text>
                        </motion.div>
                    </Container>
                </Box>

                <Container size="lg" mt="-60px" style={{ position: 'relative', zIndex: 10 } as React.CSSProperties}>
                    <Grid gutter="xl">
                        {/* Left Column */}
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Stack gap="lg">
                                {/* Contact Info Card */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                                    <Card padding="xl" className="luxury-card border-none shadow-xl">
                                        <Title order={3} mb="xl" className="text-slate-900 font-sans font-black uppercase tracking-tight text-lg">
                                            Contact Information
                                        </Title>
                                        <Stack gap="lg">
                                            {contactInfo.map((item) => (
                                                <Group key={item.title} align="flex-start" wrap="nowrap" gap="md">
                                                    <ThemeIcon size={46} radius="xl" variant="light" color="indigo" className="bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                                                        <item.icon size={20} />
                                                    </ThemeIcon>
                                                    <div>
                                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                                            {item.title}
                                                        </Text>
                                                        <Text fw={800} size="md" className="text-slate-900 leading-snug">
                                                            {item.value}
                                                        </Text>
                                                        <Text size="xs" fw={500} className="text-slate-400 mt-0.5">
                                                            {item.desc}
                                                        </Text>
                                                    </div>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Card>
                                </motion.div>

                                {/* Emergency Service Card — fixed visibility */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                                    <div
                                        style={{
                                            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            boxShadow: '0 20px 60px rgba(79, 70, 229, 0.3)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Decorative glow */}
                                        <div style={{
                                            position: 'absolute', top: '-40px', right: '-40px',
                                            width: '120px', height: '120px',
                                            background: 'rgba(99, 102, 241, 0.4)',
                                            borderRadius: '50%', filter: 'blur(40px)',
                                        }} />
                                        <div style={{
                                            position: 'absolute', bottom: '-20px', left: '20px',
                                            width: '80px', height: '80px',
                                            background: 'rgba(165, 180, 252, 0.15)',
                                            borderRadius: '50%', filter: 'blur(30px)',
                                        }} />

                                        {/* Badge */}
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            backgroundColor: 'rgba(255,255,255,0.12)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '999px',
                                            padding: '4px 14px',
                                            marginBottom: '16px',
                                        }}>
                                            <AlertCircle size={12} color="#fbbf24" />
                                            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                24 / 7 Emergency
                                            </span>
                                        </div>

                                        <h3 style={{
                                            color: '#ffffff',
                                            fontSize: '20px',
                                            fontWeight: 900,
                                            letterSpacing: '-0.02em',
                                            textTransform: 'uppercase',
                                            marginBottom: '10px',
                                            lineHeight: 1.2,
                                        }}>
                                            Emergency Service?
                                        </h3>

                                        <p style={{
                                            color: 'rgba(255,255,255,0.75)',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            lineHeight: 1.65,
                                            marginBottom: '24px',
                                        }}>
                                            Call our 24/7 emergency hotline for immediate assistance at your location. Available all day, every day.
                                        </p>

                                        {/* Info rows */}
                                        <Stack gap="sm" mb="xl">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex' }}>
                                                    <Phone size={16} color="#a5b4fc" />
                                                </div>
                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                                                        Hotline Number
                                                    </p>
                                                    <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 800, margin: 0 }}>
                                                        +977-9804851228
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex' }}>
                                                    <Clock size={16} color="#a5b4fc" />
                                                </div>
                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                                                        Availability
                                                    </p>
                                                    <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 800, margin: 0 }}>
                                                        Open 24 Hours, 7 Days
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex' }}>
                                                    <MessageCircle size={16} color="#a5b4fc" />
                                                </div>
                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                                                        WhatsApp
                                                    </p>
                                                    <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 800, margin: 0 }}>
                                                        +977-9801111111
                                                    </p>
                                                </div>
                                            </div>
                                        </Stack>

                                        <button
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                backgroundColor: '#ffffff',
                                                color: '#4338ca',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '14px 24px',
                                                fontSize: '15px',
                                                fontWeight: 800,
                                                letterSpacing: '0.02em',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                                            }}
                                        >
                                            <Phone size={18} />
                                            Call Now: +977-9804851228
                                        </button>
                                    </div>
                                </motion.div>
                            </Stack>
                        </Grid.Col>

                        {/* Right Column — Contact Form */}
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <Card padding="xl" className="luxury-card border-none shadow-xl">
                                    <Title order={3} mb="xl" className="text-slate-900 font-sans font-black uppercase tracking-tight text-lg">
                                        Send us a <span className="text-indigo-600">Message</span>
                                    </Title>
                                    <form onSubmit={handleSubmit}>
                                        <Stack gap="md">
                                            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                                <TextInput label="First Name" placeholder="Hari" required size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                                <TextInput label="Last Name" placeholder="Karki" required size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                            </SimpleGrid>
                                            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                                <TextInput label="Email Address" placeholder="ram@example.com" required size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                                <TextInput label="Phone Number" placeholder="+977-98XXXXXXXX" size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                            </SimpleGrid>
                                            <TextInput label="Subject" placeholder="How can we help you?" required size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                            <Textarea label="Message" placeholder="Your message here..." minRows={5} required size="md" radius="md" labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-slate-500' }} />
                                            <Button
                                                size="lg"
                                                radius="md"
                                                color="indigo"
                                                type="submit"
                                                fullWidth
                                                leftSection={<Send size={18} />}
                                                className="h-14 font-extrabold shadow-lg shadow-indigo-600/10 rounded-xl"
                                            >
                                                Send Message
                                            </Button>
                                        </Stack>
                                    </form>
                                </Card>
                            </motion.div>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ContactPage;
