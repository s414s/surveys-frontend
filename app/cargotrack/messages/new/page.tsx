"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateNewThreadRequest } from "@/appTypes";
import { createNewThread } from "@/utils/endpoints/threadsEndpoints";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MessageCreationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const { data, error, loading } = useFetch<string[]>("GET", "/users/email");

  if (error) console.error(error);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
  };

  const isValidEmail = (email: string) => {
    // simple regex for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, subject, message } = formData;
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!subject.trim()) {
      alert("Subject cannot be empty.");
      return;
    }
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    try {
      const request: CreateNewThreadRequest = {
        toEmail: email,
        subject,
        text: message,
      };

      console.log("REQUEST", request);

      await createNewThread(request);
      alert(`Message sent successfully!`);
      router.push("/cargotrack/messages");
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    }

    setFormData({ email: "", subject: "", message: "" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send New Message</CardTitle>
        <CardDescription>Enter the recipient, subject, and your message below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Select
              value={formData.email}
              onValueChange={handleEmailChange}
              name="email"
              required
              disabled={loading}
            >
              <SelectTrigger id="email">
                <SelectValue
                  placeholder={loading ? "Loading emails" : error ? "Failed to get emails" : "Select an email"}
                />
              </SelectTrigger>
              <SelectContent>
                {data?.map(email => (
                  <SelectItem key={email} value={email}>
                    {email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject of your message"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              rows={5}
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
