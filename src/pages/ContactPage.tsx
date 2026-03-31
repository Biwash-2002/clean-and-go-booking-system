import { Container, Title, Text, SimpleGrid, Card, Stack, TextInput, Textarea, Button, ThemeIcon, Box, Grid, Group } from '@mantine/core';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { notifications } from '@mantine/notifications';

const ContactPage = () => {
    const contactInfo = [
        { icon: Phone, title: 'Phone', value: '+977-9804851228', color: 'blue' },
        { icon: Mail, title: 'Email', value: 'Clean&go2026@gmail.com', color: 'red' },
        { icon: MapPin, title: 'Office', value: 'Lazimpat, Kathmandu', color: 'green' },
        { icon: MessageCircle, title: 'WhatsApp', value: '+977-9801111111', color: 'teal' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        notifications.show({
            title: 'Message Sent',
            message: 'Thank you for contacting us. We will get back to you soon!',
            color: 'green',
        });
    };

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '100px' } as React.CSSProperties}>
                <Box style={{
                    background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=2000")',
                    height: '40vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                } as React.CSSProperties}>
                    <Container size="md">
                        <Title order={1} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 } as React.CSSProperties}>Contact <span className="gradient-text">Our Team</span></Title>
                        <Text size="xl" mt="md" style={{ opacity: 0.8 } as React.CSSProperties}>We're here to help you keep your vehicle in pristine condition.</Text>
                    </Container>
                </Box>

                <Container size="lg" mt="-60px" style={{ position: 'relative', zIndex: 10 } as React.CSSProperties}>
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Stack gap="lg">
                                <Card padding="xl" radius="md" withBorder shadow="sm">
                                    <Title order={3} mb="xl">Contact Information</Title>
                                    <Stack gap="xl">
                                        {contactInfo.map((item) => (
                                            <Group key={item.title} align="flex-start" wrap="nowrap">
                                                <ThemeIcon size={44} radius="md" variant="light" color={item.color}>
                                                    <item.icon size={24} />
                                                </ThemeIcon>
                                                <div>
                                                    <Text size="sm" fw={700} c="dimmed">{item.title}</Text>
                                                    <Text fw={600} size="lg">{item.value}</Text>
                                                </div>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Card>

                                <Card padding="xl" radius="md" withBorder shadow="sm" style={{ backgroundColor: '#0f172a', color: 'white' } as React.CSSProperties}>
                                    <Title order={3} mb="sm">Emergency Service?</Title>
                                    <Text size="sm" mb="xl" style={{ opacity: 0.8 } as React.CSSProperties}>Call our 24/7 emergency hotline for immediate assistance at your location.</Text>
                                    <Button fullWidth size="lg" radius="md" className="gradient-button" leftSection={<Phone size={20} />}>
                                        Call: +977-9804851228
                                    </Button>
                                </Card>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Card padding="xl" radius="md" withBorder shadow="sm">
                                <Title order={3} mb="xl">Send us a <span className="gradient-text">Message</span></Title>
                                <form onSubmit={handleSubmit}>
                                    <Stack gap="md">
                                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                            <TextInput label="First Name" placeholder="Hari" required />
                                            <TextInput label="Last Name" placeholder="Karki" required />
                                        </SimpleGrid>
                                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                            <TextInput label="Email Address" placeholder="ram@example.com" required />
                                            <TextInput label="Phone Number" placeholder="+977-98XXXXXXXX" />
                                        </SimpleGrid>
                                        <TextInput label="Subject" placeholder="How can we help you?" required />
                                        <Textarea label="Message" placeholder="Your message here..." minRows={4} required />
                                        <Button
                                            size="lg"
                                            radius="md"
                                            className="gradient-button"
                                            type="submit"
                                            fullWidth
                                            leftSection={<Send size={18} />}
                                        >
                                            Send Message
                                        </Button>
                                    </Stack>
                                </form>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ContactPage;
