import { Container, Text, Button, Group, Stack, SimpleGrid, Badge, Avatar, Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, MapPin, Star, Sparkles, Zap, Droplets, CheckCircle2, Crown, Layers, RefreshCw, Gauge } from 'lucide-react';
import { WASH_PACKAGES, WASHING_CENTERS } from '../constants/data';
import Layout from '../components/Layout';
import GoogleMapComponent from '../components/GoogleMap';

const HomePage = () => {
    const navigate = useNavigate();

    const oneTimePlans = WASH_PACKAGES.filter(p => p.planType === 'one-time');
    const subscriptionPlans = WASH_PACKAGES.filter(p => p.planType === 'subscription');

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=2000" 
                        alt="Premium Car Wash" 
                        className="w-full h-full object-cover opacity-35 scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
                </div>

                <Container size="lg" className="relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <Badge 
                            size="lg" 
                            variant="filled" 
                            className="bg-indigo-600 mb-6 px-4 py-1 h-auto rounded-lg text-xs font-bold tracking-widest uppercase shadow-md shadow-indigo-600/25"
                        >
                            <Sparkles size={14} className="mr-2 inline text-amber-400" /> #1 Premium Car Detailing in Nepal
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight font-sans">
                            Your Car Deserves <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Absolute Perfection</span>
                        </h1>
                        <Text className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl font-medium">
                            Experience the next generation of car detailing. Eco-friendly technology, 
                            expert care, and seamless online booking at your fingertips.
                        </Text>
                        <Group gap="md">
                            <Button
                                size="xl"
                                radius="md"
                                className="bg-indigo-600 hover:bg-indigo-700 h-16 px-10 shadow-lg shadow-indigo-900/35 font-bold tracking-wide"
                                onClick={() => navigate('/book')}
                                rightSection={<ArrowRight size={20} />}
                            >
                                Book Now
                            </Button>
                            <Button 
                                size="xl" 
                                radius="md" 
                                variant="outline" 
                                className="h-16 px-10 border-2 text-white border-white/20 hover:bg-white/10 hover:border-white/40 font-bold"
                            >
                                View Services
                            </Button>
                        </Group>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1,2,3,4].map(idx => (
                                    <Avatar key={idx} src={`https://i.pravatar.cc/150?u=${idx}`} radius="xl" className="border-2 border-slate-950" />
                                ))}
                            </div>
                            <div>
                                <div className="flex text-amber-400 gap-0.5 mb-1">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <Text className="text-slate-400 text-sm font-semibold">Trusted by 2,000+ car owners</Text>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Features Bar */}
            <div className="bg-slate-50 border-y border-slate-100 py-10">
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                        {[
                            { icon: <Shield className="text-indigo-600" />, title: "Full Protection", desc: "Premium ceramic coatings & wax" },
                            { icon: <Clock className="text-indigo-600" />, title: "Fast Turnaround", desc: "Professional wash in 30-60 mins" },
                            { icon: <Zap className="text-indigo-600" />, title: "Eco-Friendly", desc: "90% less water usage technology" },
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100/50 hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                                <div className="p-3 bg-indigo-50 rounded-xl">{feat.icon}</div>
                                <div>
                                    <Text fw={800} className="text-slate-900 uppercase tracking-tight text-sm font-sans">{feat.title}</Text>
                                    <Text size="sm" className="text-slate-500 font-medium">{feat.desc}</Text>
                                </div>
                            </div>
                        ))}
                    </SimpleGrid>
                </Container>
            </div>

            {/* Service Packages — Premium Futuristic Pricing */}
            <section className="pricing-section py-28 relative" style={{ background: 'var(--pricing-bg)' }}>

                {/* Animated grid background */}
                <div className="pricing-grid-bg" />

                {/* Ambient floating orbs */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '50%', left: '45%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>

                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 72 }}
                    >
                        <div className="pricing-heading-label" style={{ display: 'inline-flex' }}>
                            <Sparkles size={12} />
                            Premium Service Plans
                        </div>
                        <h2 className="pricing-section-title">
                            Choose Your{' '}
                            <span className="gradient-highlight">Perfect Plan</span>
                        </h2>
                        <p className="pricing-section-subtitle" style={{ margin: '0 auto' }}>
                            We offer flexible options for every car owner. Choose a one-time refresh or join our premium club.
                        </p>
                    </motion.div>

                    {/* ── ONE-TIME PLANS ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="pricing-category-badge one-time">
                            <Droplets size={14} />
                            One-Time Refresh
                        </div>
                    </motion.div>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={28} mb={0}>
                        {oneTimePlans.map((pkg, i) => {
                            const orbColors = ['#00d4ff', '#22d3ee', '#a855f7'];
                            const icons = [
                                { icon: <Droplets size={15} />, label: 'Crystal Foam Wash', color: 'blue' },
                                { icon: <Clock size={15} />, label: `${pkg.duration} Mins Express`, color: 'amber' },
                                { icon: <MapPin size={15} />, label: 'At Any Center', color: 'emerald' },
                            ];
                            return (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    viewport={{ once: true }}
                                    style={{ height: '100%' }}
                                >
                                    <div className="pricing-card" style={{ height: '100%' }}>
                                        {/* Glow orb */}
                                        <div className="card-glow-orb" style={{ background: orbColors[i] }} />
                                        {/* Hover ring */}
                                        <div className="hover-ring" />

                                        {/* Package name */}
                                        <div className="pkg-name">{pkg.name}</div>

                                        {/* Price */}
                                        <div className="price-block">
                                            <span className="price-currency">Rs.</span>
                                            <span className="price-amount">{pkg.price}</span>
                                        </div>
                                        <div style={{ marginBottom: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                                            One-time payment
                                        </div>

                                        {/* Description */}
                                        <div className="pkg-desc">{pkg.description}</div>

                                        {/* Features */}
                                        <ul className="feature-list">
                                            {icons.map((f, fi) => (
                                                <li key={fi} className="feature-item">
                                                    <span className={`feature-icon ${f.color}`}>{f.icon}</span>
                                                    {f.label}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <button
                                            className="pricing-cta-btn default"
                                            onClick={() => navigate('/book', { state: { pkgId: pkg.id, planType: pkg.planType } })}
                                        >
                                            <Zap size={14} />
                                            Book Now
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </SimpleGrid>

                    {/* Section divider */}
                    <div className="pricing-divider">
                        <span className="pricing-divider-icon">✦</span>
                    </div>

                    {/* ── SUBSCRIPTION PLANS ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="pricing-category-badge subscription">
                            <Crown size={14} />
                            Monthly Membership
                        </div>
                    </motion.div>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={28}>
                        {subscriptionPlans.map((pkg, i) => {
                            const isFeatured = pkg.id === 'sub-premium';
                            const orbColors = ['#6366f1', '#00d4ff', '#a855f7'];
                            const featureIcons = [
                                { icon: <Layers size={15} />, label: `${pkg.limit} Detailed Washes`, color: isFeatured ? 'blue' : 'purple' },
                                { icon: <Shield size={15} />, label: 'Priority Support', color: isFeatured ? 'emerald' : 'blue' },
                                { icon: <Gauge size={15} />, label: 'Global Access', color: isFeatured ? 'purple' : 'amber' },
                            ];
                            return (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    viewport={{ once: true }}
                                    style={{ height: '100%' }}
                                >
                                    <div className={`pricing-card${isFeatured ? ' featured' : ''}`} style={{ height: '100%' }}>

                                        {/* Shimmer top bar on featured */}
                                        {isFeatured && <div className="shimmer-top" />}

                                        {/* Glow orb */}
                                        <div className="card-glow-orb" style={{ background: orbColors[i] }} />

                                        {/* Hover ring */}
                                        <div className="hover-ring" />

                                        {/* Best Value badge */}
                                        {isFeatured && (
                                            <div className="best-value-badge">
                                                ⚡ Best Value
                                            </div>
                                        )}

                                        {/* Package name */}
                                        <div className="pkg-name">{pkg.name}</div>

                                        {/* Price */}
                                        <div className="price-block">
                                            <span className="price-currency">Rs.</span>
                                            <span className="price-amount">{pkg.price}</span>
                                            <span className="price-suffix">/mo</span>
                                        </div>
                                        <div style={{ marginBottom: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                                            Billed monthly · Cancel anytime
                                        </div>

                                        {/* Description */}
                                        <div className="pkg-desc">{pkg.description}</div>

                                        {/* Features */}
                                        <ul className="feature-list">
                                            {featureIcons.map((f, fi) => (
                                                <li key={fi} className="feature-item">
                                                    <span className={`feature-icon ${f.color}`}>{f.icon}</span>
                                                    {f.label}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <button
                                            className={`pricing-cta-btn ${isFeatured ? 'featured-btn' : 'sub-default'}`}
                                            onClick={() => navigate('/book', { state: { pkgId: pkg.id, planType: pkg.planType } })}
                                        >
                                            <RefreshCw size={14} />
                                            Join
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </SimpleGrid>

                    {/* Bottom tagline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginTop: 52 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <CheckCircle2 size={16} style={{ color: '#fbbf24' }} />
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', fontWeight: 600 }}>
                                No hidden fees · Instant booking confirmation · 100% satisfaction guarantee
                            </span>
                        </div>
                    </motion.div>

                </Container>
            </section>

            {/* Map Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-20"></div>
                <Container size="lg" className="relative z-10">
                    <Grid gutter={80} align="center">
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Badge variant="dot" color="indigo" size="lg" mb="md" className="uppercase tracking-widest pl-0 font-bold">Our Network</Badge>
                            <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight font-sans">Find Us in Your <br/><span className="text-indigo-600">Local Area</span></h2>
                            <Text className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                                We have flagship service centers across Kathmandu valley, 
                                each equipped with state-of-the-art washing technology and 
                                comfortable waiting lounges.
                            </Text>
                            
                            <Stack gap="lg">
                                {WASHING_CENTERS.slice(0, 3).map(center => (
                                    <div key={center.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/book', { state: { centerId: center.id } })}>
                                        <div className="w-12 h-12 shrink-0 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300 shadow-sm shadow-indigo-100">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <Text fw={800} className="text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight font-sans">{center.name}</Text>
                                            <Text size="sm" className="text-slate-500 font-semibold">{center.address}</Text>
                                        </div>
                                    </div>
                                ))}
                            </Stack>

                            <Button 
                                variant="subtle" 
                                size="lg" 
                                color="indigo"
                                mt="xl" 
                                className="text-indigo-600 font-black p-0 hover:bg-transparent hover:translate-x-1 transition-transform"
                                rightSection={<ArrowRight size={18} />}
                                onClick={() => navigate('/locations')}
                            >
                                View all 4 locations
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-950/10 border-8 border-slate-50 h-[500px]">
                                <GoogleMapComponent locations={WASHING_CENTERS} />
                            </div>
                        </Grid.Col>
                    </Grid>
                </Container>
            </section>
        </Layout>
    );
};

export default HomePage;
