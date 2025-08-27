import { Suspense } from "react";
import { BarLoader } from "react-spinners";

async function ProjectLayout({ children }) {
	return (
		<div className="mx-auto">
			<Suspense fallback={<BarLoader width={"100%"} color="#36D7B7" />}>
				{children}
			</Suspense>
		</div>
	);
}

export default ProjectLayout;
