import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserLoading from "./user-loading";
import UserMenu from "./user-menu";

function HeaderClient() {
	return (
		<header className="container mx-auto">
			<nav className="py-6 px-4 flex justify-between items-center">
				<Link href="#">
					<Image
						src="/ajira.svg"
						alt="Logo"
						width={"200"}
						height={"56"}
						className="h-10 w-auto object-contain"
					/>
				</Link>

				<div className="flex items-center gap-4">
					<Link href={"/projects/create"}>
						<Button
							className={"flex items-center gap-2"}
							variant={"destructive"}
						>
							<PenBox size={18} />
							<span>Create Project</span>
						</Button>
					</Link>

					<SignedOut>
						<SignInButton forceRedirectUrl="/onboarding">
							<Button variant={"outline"}>Login</Button>
						</SignInButton>
					</SignedOut>
					{/* if user is logged in, show the user button  */}
					<SignedIn>
						<UserMenu />
					</SignedIn>
				</div>
			</nav>
			<UserLoading />
		</header>
	);
}

export default HeaderClient;
