export function generateStaticParams() {
    return [
        { stype: "events" },
        { stype: "masterclass" },
        { stype: "training" }
    ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
