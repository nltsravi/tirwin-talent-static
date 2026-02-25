import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="modern">
            <div className="body-inner">
                <Header />
                <div className="content-wrapper">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
