export function generateStaticParams() {
    return [
        { stype: "events", id: "default" },
        { stype: "masterclass", id: "default" },
        { stype: "training", id: "default" }
    ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
