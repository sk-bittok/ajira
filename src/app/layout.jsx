import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Fira_Code, Roboto } from "next/font/google";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { Toaster } from "sonner";
import RootProvider from "@/components/providers/root-provider";

const robotSans = Roboto({
	variable: "--font-roboto-sans",
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "800", "900"],
});

const firaCode = Fira_Code({
	variable: "--font-fira-code",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata = {
	title: "Ajira",
	description: "A Project Management App",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider
			appearance={{
				theme: shadesOfPurple,
				variables: {
					colorPrimary: "#3B82F6",
					colorInput: "#2D3748",
					colorBackground: "#1A202C",
					colorInputForeground: "#F3F4F6",
				},
				elements: {
					formButtonPrimary: "bg-purple-600 hover:opacity-90 text-white",
					card: "bg-gray-800",
					headerTitle: "text-blue-500",
					headerSubtitle: "text-gray-400",
				},
			}}
		>
			<html lang="en" suppressHydrationWarning>
				<body
					className={`${robotSans.variable} ${firaCode.variable} antialiased dotted-background`}
				>
					<RootProvider>
						<ThemeProvider
							attribute={"class"}
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<Header />
							<main className="min-h-screen">{children}</main>
							<Toaster richColors position="top-center" />
							<footer className="bg-gray-900 py-12">
								<div className="container mx-auto px-4 text-center text-gray-200">
									<p>
										Sentinel &copy;<span>&nbsp;{new Date().getFullYear()}</span>
									</p>
								</div>
							</footer>
						</ThemeProvider>
					</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
