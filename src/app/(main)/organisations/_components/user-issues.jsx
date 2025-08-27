"use client";

import { Suspense, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getUserIssues } from "@/actions/issues";
import IssueCard from "@/components/issue-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function UserIssues({ userId }) {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(false);
	const [issueError, setIssueError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchIssues() {
			setLoading(true);
			try {
				const data = await getUserIssues(userId);
				if (isMounted) {
					setIssues(data ?? []);
					setIssueError(null);
				}
			} catch (err) {
				setIssueError(err);
			} finally {
				if (isMounted) setLoading(false);
			}
		}
		fetchIssues();

		return () => {
			isMounted = false;
		};
	}, [userId]);

	if (loading) {
		return <BarLoader width={"100%"} color="#36D7B7" />;
	}

	if (issueError !== null) {
		return (
			<div>
				<p className="text-red-500 font-medium p-2">{issueError?.message}</p>
			</div>
		);
	}

	if (issues.length === 0) {
		return (
			<div className="w-full h-full">
				<p>No issues found</p>
			</div>
		);
	}

	const assignedIssues = issues.filter(
		(issue) => issue.assignee.clerkUserId === userId,
	);

	const reportedIssues = issues.filter(
		(issue) => issue.reporter.clerkUserId === userId,
	);

	return (
		<>
			<h1 className="text-4xl gradient-title mb-4 font-bold">My Issues</h1>
			<Tabs defaultValue="reported" className="w-full">
				<TabsList>
					<TabsTrigger value="assigned">Assigned</TabsTrigger>
					<TabsTrigger value="reported">Reported</TabsTrigger>
				</TabsList>
				<TabsContent value="assigned">
					<Suspense fallback={<BarLoader width={"100%"} color="#36D7B7" />}>
						<IssueGrid issues={assignedIssues} />
					</Suspense>
				</TabsContent>
				<TabsContent value="reported">
					<Suspense fallback={<BarLoader width={"100%"} color="#36D7B7" />}>
						<IssueGrid issues={reportedIssues} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</>
	);
}

function IssueGrid({ issues }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{issues.map((issue) => (
				<IssueCard key={issue.id} issue={issue} showStatus />
			))}
		</div>
	);
}

export default UserIssues;
