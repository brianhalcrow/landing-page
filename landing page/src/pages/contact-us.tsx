import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useState } from "react";
import { countries, type Country } from "@/lib/countries";
import { countryCodes, type CountryCode } from "@/lib/countryCodes";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    howDidYouHear: "",
    phoneNumber: "",
    message: "",
    consentMarketing: false,
    consentPrivacy: false,
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    company: false,
    jobTitle: false,
    howDidYouHear: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const shouldShowError = (field: keyof typeof touched) => {
    return (touched[field] || isSubmitted) && !formData[field];
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Check if all required fields are filled
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "company",
      "jobTitle",
      "howDidYouHear",
    ];
    const isValid = requiredFields.every(
      (field) => formData[field as keyof typeof formData]
    );

    if (isValid) {
      // Handle form submission here
      console.log(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center py-12">
      <Card className="w-[600px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/sensefx-logo.svg"
              alt="SenseFX Logo"
              className="h-16 w-auto mb-8"
            />
            <p className="text-base text-gray-600">
              Please provide your details and we will get back to you as soon as
              possible
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  First name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  onBlur={() => handleBlur("firstName")}
                />
                {shouldShowError("firstName") && (
                  <p className="text-sm text-red-500"></p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Last name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  onBlur={() => handleBlur("lastName")}
                />
                {shouldShowError("lastName") && (
                  <p className="text-sm text-red-500"></p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Business email<span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={() => handleBlur("email")}
                />
                {shouldShowError("email") && (
                  <p className="text-sm text-red-500"></p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Company name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  onBlur={() => handleBlur("company")}
                />
                {shouldShowError("company") && (
                  <p className="text-sm text-red-500"></p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Job Title<span className="text-red-500">*</span>
              </label>
              <Input
                id="jobTitle"
                required
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                onBlur={() => handleBlur("jobTitle")}
              />
              {shouldShowError("jobTitle") && (
                <p className="text-sm text-red-500"></p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                How did you first hear about SenseFX?
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="howDidYouHear"
                required
                value={formData.howDidYouHear}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, howDidYouHear: e.target.value })
                }
                onBlur={() => handleBlur("howDidYouHear")}
              />
              {shouldShowError("howDidYouHear") && (
                <p className="text-sm text-red-500"></p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Phone number (optional)
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Message (optional)</label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent-marketing"
                  checked={formData.consentMarketing}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({
                      ...formData,
                      consentMarketing: checked,
                    })
                  }
                />
                <label
                  htmlFor="consent-marketing"
                  className="text-sm leading-none"
                >
                  I consent to receive information about SenseFX products and
                  services
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent-privacy"
                  required
                  checked={formData.consentPrivacy}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({
                      ...formData,
                      consentPrivacy: checked,
                    })
                  }
                />
                <label
                  htmlFor="consent-privacy"
                  className="text-sm leading-none"
                >
                  I have read and accept the{" "}
                  <Link
                    to="/policies/privacy-policy"
                    className="text-[#206d69] hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#206d69] hover:bg-[#206d69]/90 mt-6"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
