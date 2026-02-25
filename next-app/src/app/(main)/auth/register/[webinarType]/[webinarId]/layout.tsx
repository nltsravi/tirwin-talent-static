export function generateStaticParams() {
    return [
        { webinarType: "events", webinarId: "default" },
        { webinarType: "masterclass", webinarId: "default" },
        { webinarType: "training", webinarId: "default" }
    ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
