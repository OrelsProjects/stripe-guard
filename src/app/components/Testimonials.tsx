import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "This tool has been a game-changer for our business. We've reduced payment errors by 80% since implementing it.",
    author: "Jane Doe",
    role: "CEO, TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The real-time alerts have saved us countless hours of manual monitoring. Highly recommended!",
    author: "John Smith",
    role: "CTO, StartupX",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "Beautiful graphs and intuitive interface. It's made our financial reporting so much easier.",
    author: "Emily Brown",
    role: "CFO, GrowthCo",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-muted">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="pt-6">
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.author}
                  />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
