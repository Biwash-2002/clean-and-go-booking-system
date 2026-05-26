import { Container, Title, Text, SimpleGrid, Card, Image, Stack, Group, ThemeIcon, Box } from '@mantine/core';
import { ShieldCheck, Target, Users, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const AboutPage = () => {
    const stats = [
        { label: 'Happy Customers', value: '10,000+', icon: Users, color: 'blue' },
        { label: 'Clean Cars', value: '25,000+', icon: Target, color: 'teal' },
        { label: 'Washing Points', value: '4 Major Points', icon: ShieldCheck, color: 'indigo' },
        { label: 'Eco-Friendly', value: '100%', icon: Zap, color: 'orange' },
    ];

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f8fafc', paddingBottom: '100px' }}>
                <Box style={{
                    background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=2000")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '42vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                } as React.CSSProperties}>
                    <Container size="md">
                        <Title order={1} className="font-sans font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900 } as React.CSSProperties}>About Clean & Go</Title>
                        <Text size="xl" mt="md" style={{ opacity: 0.85, fontWeight: 500 } as React.CSSProperties}>Setting the standard for vehicle care in Nepal since 2020.</Text>
                    </Container>
                </Box>

                <Container size="lg" mt={80}>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
                        <Stack gap="xl">
                            <div>
                                <Title order={2} mb="md" className="font-sans font-black uppercase tracking-tight text-slate-900">Our <span className="text-indigo-600">Mission</span></Title>
                                <Text style={{ lineHeight: 1.8 }} className="text-slate-600 font-medium">
                                    At Clean & Go, we believe that a clean car is a happy car. Our mission is to provide premium, professional, and accessible car washing services using the latest technology while being environmentally conscious. We aim to revolutionize the car wash industry in Nepal with our online booking system and subscription-based models.
                                </Text>
                            </div>
                            <div>
                                <Title order={2} mb="md" className="font-sans font-black uppercase tracking-tight text-slate-900">Why Choose Us?</Title>
                                <Stack gap="md">
                                    <Group>
                                        <ThemeIcon color="indigo" variant="light" size="md" radius="lg"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={700} className="text-slate-700">Professional Grade Equipment</Text>
                                    </Group>
                                    <Group>
                                        <ThemeIcon color="indigo" variant="light" size="md" radius="lg"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={700} className="text-slate-700">Experienced and Trained Staff</Text>
                                    </Group>
                                    <Group>
                                        <ThemeIcon color="indigo" variant="light" size="md" radius="lg"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={700} className="text-slate-700">Eco-Friendly Cleaning Products</Text>
                                    </Group>
                                </Stack>
                            </div>
                        </Stack>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card padding={0} radius="xl" shadow="xl" className="border-none overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=1000"
                                    alt="Car Wash Service"
                                />
                            </Card>
                        </motion.div>
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" mt={100}>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card padding="xl" className="luxury-card ta-center" style={{ height: '100%' } as React.CSSProperties}>
                                    <ThemeIcon variant="light" size={60} radius="xl" color="indigo" mb="md" className="mx-auto bg-indigo-50 text-indigo-600">
                                        <stat.icon size={28} />
                                    </ThemeIcon>
                                    <Text fw={900} size="2rem" mb={4} className="text-slate-900 font-sans tracking-tight">{stat.value}</Text>
                                    <Text size="xs" fw={700} className="text-slate-400 uppercase tracking-widest">{stat.label}</Text>
                                </Card>
                            </motion.div>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>
        </Layout>
    );
};

export default AboutPage;
