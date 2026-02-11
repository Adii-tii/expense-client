import HeroSection from "../components/landing/Hero";
import FeatureSection from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";
import Testimonials from "../components/landing/Testimonials";
import AboutSection from "../components/landing/About";

function Home(){
    return(
        <div className="text-center">
            <HeroSection />
            <FeatureSection />
            <HowItWorks />
            <AboutSection />
            <CTASection />
            <Testimonials />
        </div>
    )
}

export default Home;