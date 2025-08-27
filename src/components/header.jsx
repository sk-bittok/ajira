import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./header-client";

async function Header() {
	await checkUser();

	return <HeaderClient />;
}

export default Header;
