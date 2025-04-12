import { cn } from "@/lib/utils";

const services = [
  {
    icon: "/Arch_Amazon-Simple-Storage-Service_64.svg",
    name: "S3",
  },
  {
    icon: "/Arch_Amazon-SageMaker_64.svg",
    name: "SageMaker",
  },
  {
    icon: "/Arch_Amazon-RDS_64.svg",
    name: "RDS",
  },
  {
    icon: "/Arch_Amazon-Redshift_64.svg",
    name: "Redshift",
  },
  {
    icon: "/Arch_AWS-Well-Architected-Tool_64.svg",
    name: "Well-Architected",
  },
  {
    icon: "/Arch_Amazon-Cognito_64.svg",
    name: "Cognito",
  },
];

export function CloudInfrastructure() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] sm:leading-tight">
            SenseFX is building on AWS,
            <br />
            ensuring the highest standards of scalability, security, and
            performance
          </h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-12 max-w-6xl mx-auto mb-24">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={service.icon}
                alt={service.name}
                className="w-20 h-20 object-contain"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a href="https://aws.amazon.com/what-is-cloud-computing">
            <img
              src="https://d0.awsstatic.com/logos/powered-by-aws.png"
              alt="Powered by AWS Cloud Computing"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
