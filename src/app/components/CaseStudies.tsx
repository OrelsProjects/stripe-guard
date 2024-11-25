import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const caseStudies = [
  {
    company: "TechGrowth Inc.",
    industry: "SaaS",
    challenge: "High rate of failed payments due to expired cards",
    solution:
      "Implemented smart retry logic and proactive card update reminders",
    result:
      "Reduced failed payments by 62% and increased monthly recurring revenue by 15%",
  },
  {
    company: "E-commerce Express",
    industry: "Retail",
    challenge: "Difficulty identifying patterns in fraudulent transactions",
    solution: "Utilized machine learning-based fraud detection system",
    result:
      "Decreased fraudulent transactions by 78% while maintaining a low false positive rate",
  },
  {
    company: "SubscribeNow",
    industry: "Digital Media",
    challenge: "High churn rate due to failed subscription renewals",
    solution: "Implemented intelligent dunning management system",
    result: "Recovered 45% of failed payments and reduced churn rate by 30%",
  },
];

export default function CaseStudies() {
  return (
    <div className="py-24 px-4 md:px-6 lg:px-8 text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies && caseStudies.length > 0 ? (
            caseStudies.map((study, index) => (
              <Card key={index} className="bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">{study.company}</CardTitle>
                  <Badge variant="secondary">{study.industry}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    <strong>Challenge:</strong> {study.challenge}
                  </CardDescription>
                  <CardDescription className="text-gray-300 mb-4">
                    <strong>Solution:</strong> {study.solution}
                  </CardDescription>
                  <CardDescription className="text-green-400">
                    <strong>Result:</strong> {study.result}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-white">No case studies available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
