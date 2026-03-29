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
            <Box style={{ backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
                <Box style={{
                    background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=2000")',
                    height: '40vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                } as any}>
                    <Container size="md">
                        <Title order={1} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 } as any}>About Nepal Wash</Title>
                        <Text size="xl" mt="md" style={{ opacity: 0.8 } as any}>Setting the standard for vehicle care in Nepal since 2020.</Text>
                    </Container>
                </Box>

                <Container size="lg" mt={60}>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
                        <Stack gap="xl">
                            <div>
                                <Title order={2} mb="md">Our <span className="gradient-text">Mission</span></Title>
                                <Text style={{ lineHeight: 1.7 }} c="dimmed">
                                    At Nepal Wash, we believe that a clean car is a happy car. Our mission is to provide premium, professional, and accessible car washing services using the latest technology while being environmentally conscious. We aim to revolutionize the car wash industry in Nepal with our online booking system and subscription-based models.
                                </Text>
                            </div>
                            <div>
                                <Title order={2} mb="md">Why Choose Us?</Title>
                                <Stack gap="sm">
                                    <Group>
                                        <ThemeIcon color="blue" size="md" radius="xl"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={600}>Professional Grade Equipment</Text>
                                    </Group>
                                    <Group>
                                        <ThemeIcon color="blue" size="md" radius="xl"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={600}>Experienced and Trained Staff</Text>
                                    </Group>
                                    <Group>
                                        <ThemeIcon color="blue" size="md" radius="xl"><ShieldCheck size={18} /></ThemeIcon>
                                        <Text size="sm" fw={600}>Eco-Friendly Cleaning Products</Text>
                                    </Group>
                                </Stack>
                            </div>
                        </Stack>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card padding={0} radius="lg" shadow="xl">
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
                                <Card padding="xl" radius="md" withBorder ta="center" style={{ height: '100%' } as any}>
                                    <ThemeIcon variant="light" size={60} radius="xl" color={stat.color} mb="md">
                                        <stat.icon size={34} />
                                    </ThemeIcon>
                                    <Text fw={800} size="2rem" mb={4}>{stat.value}</Text>
                                    <Text size="sm" c="dimmed" fw={600}>{stat.label}</Text>
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
