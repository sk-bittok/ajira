"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

function UserMenu() {
	return (
		<UserButton
			appearance={{
				elements: {
					avatarBox: "w-10 h-10",
				},
			}}
		>
			<UserButton.MenuItems>
				<UserButton.Link
					label="Organisations"
					labelIcon={<ChartNoAxesGantt size={15} />}
					href="/onboarding"
				></UserButton.Link>
			</UserButton.MenuItems>
		</UserButton>
	);
}

export default UserMenu;
