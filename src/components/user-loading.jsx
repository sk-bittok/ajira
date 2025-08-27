"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";

function UserLoading() {
	const { isLoaded } = useOrganization();
	const { isLoaded: isUserLoaded } = useUser();

	if (!isLoaded || !isUserLoaded) {
		return <BarLoader className="mb-4" width={"100%"} color="#36D7B7" />;
	}

	return <></>;
}

export default UserLoading;
