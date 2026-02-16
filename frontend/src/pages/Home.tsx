import Header from '../sections/Header';
import Hero from '../sections/Hero';
import Stats from '../sections/Stats';
import Courses from '../sections/Courses';
import WhyChoose from '../sections/WhyChoose';
import HowItWorks from '../sections/HowItWorks';
import Testimonials from '../sections/Testimonials';
import CTA from '../sections/CTA';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <main className="bg-[#020617] min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Courses />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
