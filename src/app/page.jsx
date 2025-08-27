"use client";

import {
	ArrowRight,
	ChevronRight,
	Clock,
	Layout,
	LineChart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CompanyCarousel from "@/components/company-carousel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import faqs from "@/data/faqs";

const features = [
	{
		title: "Intuitive Interface",
		description:
			"Easily navigate through tasks and projects with our user-friendly design.",
		icon: Layout,
	},
	{
		title: "Real-time Collaboration",
		description:
			"Work together seamlessly with your team, no matter where you are.",
		icon: Clock,
	},
	{
		title: "Advanced Analytics",
		description:
			"Gain insights into your project performance with our powerful analytics tools.",
		icon: LineChart,
	},
];

export default function Home() {
	return (
		<div className="min-h-screen">
			{/* Hero */}
			<section className="container mx-auto py-20 text-center">
				<h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
					Streamline Your Workflow
					<br />
					<span className="flex mx-auto gap-3 sm:gap-4 items-center">
						with&nbsp;
						<Image
							src={"/ajira2.svg"}
							alt="Logo"
							width={400}
							height={80}
							className="h-14 sm:h-24 w-auto object-contain"
						/>
					</span>
				</h1>
				<p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
					Empower your team with our genius solutions to project management.
				</p>
				<Link href={"/onboarding"}>
					<Button className={"mr-4"} size={"lg"}>
						Get Started <ChevronRight size={18} />
					</Button>
				</Link>
				<Link href={"#features"}>
					<Button className={"mr-4"} size={"lg"} variant={"outline"}>
						Learn More
					</Button>
				</Link>
			</section>
			{/* Features */}
			<section className="bg-gray-900 py-20 px-5" id="features">
				<div className="container mx-auto">
					<h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							return (
								<Card
									key={`idx${index}-${feature.title}`}
									className="bg-gray-800"
								>
									<CardContent className="pt-6">
										<feature.icon className="w-12 h-12 mb-4 text-blue-300" />
										<h4 className="font-semibold text-3xl mb-2">
											{feature.title}
										</h4>
										<p className="text-gray-300">{feature.description}</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>
			{/* Carousel with industry adopters */}
			<section className="py-20">
				<div className="container mx-auto">
					<h3 className="text-3xl font-bold mb-12 text-center">
						Trusted By Industry Leaders
					</h3>
					<CompanyCarousel />
				</div>
			</section>
			{/* Frequently asked questions */}
			<section className="bg-gray-900 py-20 px-5">
				<div className="container mx-auto">
					<h3 className="text-3xl font-bold mb-12 text-center">
						Frequently Asked Questions
					</h3>
					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={`idx-${index}-${faq.question}`}
								value={faq.question}
							>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>
			{/* Call to actions */}
			<section className="py-20 text-center px-5">
				<div className="container mx-auto">
					<h3 className="text-3xl font-bold mb-6 capitalize">
						Ready to Transform your workflow
					</h3>
					<p className="text-xl mb-8">
						Many teams have streamlined their projects and boosted productivity
						by using Ajira. Join them today.
					</p>
					<Link href={"/onboarding"}>
						<Button size={"lg"} className={"animate-bounce"}>
							Start For Free &nbsp;
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
